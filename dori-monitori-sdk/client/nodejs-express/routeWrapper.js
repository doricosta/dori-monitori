const { sendTrace } = require('./tracer')

function routeWrapper(handler, metadata = {}) {
  return async (req, res, next) => {
    const startTimeMs = Date.now()
    let finalResponse
    let handlerReturn
    let responseSent = false

    const originalSend = res.send
    const originalJson = res.json
    const originalEnd = res.end

    res.send = function(body) {
      if (!responseSent) {
        finalResponse = body
        responseSent = true
      }
      return originalSend.call(this, body)
    }

    res.json = function(body) {
      if (!responseSent) {
        finalResponse = body
        responseSent = true
      }
      return originalJson.call(this, body)
    }

    res.end = function(body) {
      if (!responseSent) {
        finalResponse = body
        responseSent = true
      }
      return originalEnd.call(this, body)
    }

    try {
      handlerReturn = await handler(req, res, next)
    } catch (err) {
      finalResponse = { error: 'An error occurred', details: err.message }
      if (!responseSent) {
        res.status(500).json(finalResponse)
        responseSent = true
      }
      next(err)
    } finally {
      let size = 0
      if (finalResponse !== undefined) {
        size = typeof finalResponse === 'string' 
          ? Buffer.byteLength(finalResponse, 'utf8')
          : Buffer.byteLength(JSON.stringify(finalResponse), 'utf8')
      }

      const traceData = {
        metodo: req.method,
        path: req.path,
        status_code: res.statusCode,
        duracao_ms: Date.now() - startTimeMs,
        tamanho: size,
        ip: req.ip || req.connection?.remoteAddress,
        user_agent: req.headers?.['user-agent'],
        metadata
      }

      if (req.body && Object.keys(req.body).length > 0) {
        traceData.corpo = req.body
      }
      
      if (req.query && Object.keys(req.query).length > 0) {
        traceData.query = req.query
      }

      if (handlerReturn !== undefined) {
        traceData.metadata = {
          ...metadata,
          handler_data: handlerReturn
        }
      } else {
        traceData.metadata = metadata
      }
      sendTrace(traceData)
    }
  }
}

module.exports = { routeWrapper }