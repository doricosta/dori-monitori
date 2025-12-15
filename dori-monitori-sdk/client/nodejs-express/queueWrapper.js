const { sendTrace } = require('./tracer')

function safeJob(job) {
  if (!job) return null
  const queueName = job.queue?.name || job.queueName || null
  const id = job.id ?? job.jobId ?? null
  const name = job.name ?? null
  const attemptsMade = job.attemptsMade ?? job.attempts ?? null
  const timestamp = job.timestamp ?? job.processedOn ?? job.createdOn ?? null
  const opts = job.opts ?? job.options ?? null
  const data = job.data ?? null
  return { id, name, queue: queueName, attemptsMade, timestamp, opts, data }
}

function sizeOf(obj) {
  if (obj === undefined || obj === null) return 0
  try {
    if (typeof obj === 'string') return Buffer.byteLength(obj, 'utf8')
    return Buffer.byteLength(JSON.stringify(obj), 'utf8')
  } catch {
    return 0
  }
}

function queueWrapper(handler, metadata = {}) {
  return async (job) => {
    const startTimeMs = Date.now()
    const jobMeta = safeJob(job)
    try {
      const result = await handler(job)
      const traceData = {
        metodo: 'QUEUE',
        path: jobMeta?.queue || jobMeta?.name || 'job',
        status_code: 200,
        duracao_ms: Date.now() - startTimeMs,
        tamanho: sizeOf(result),
        metadata: {
          ...metadata,
          handler_data: result,
          job: jobMeta
        }
      }
      sendTrace(traceData)
      return result
    } catch (err) {
      const traceData = {
        metodo: 'QUEUE',
        path: jobMeta?.queue || jobMeta?.name || 'job',
        status_code: 500,
        duracao_ms: Date.now() - startTimeMs,
        tamanho: 0,
        metadata: {
          ...metadata,
          error: { message: err?.message, stack: err?.stack },
          job: jobMeta
        }
      }
      sendTrace(traceData)
      throw err
    }
  }
}

module.exports = { queueWrapper }
