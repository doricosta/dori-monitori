const { getTraceUrl, getApiKey } = require('./config')
async function sendTrace(traceData) {
  setImmediate(async () => {
    try {
      const url = getTraceUrl()
      if (url) {
        const apiKey = getApiKey()
        await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(apiKey ? { 'x-api-key': apiKey } : {})
          },
          body: JSON.stringify(traceData)
        })
      }
    } catch (err) {
      console.error('❌ Error sending trace:', err)
    }
  })
}
module.exports = { sendTrace }
