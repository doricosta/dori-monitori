const { getLogUrl, getApiKey } = require('./config')
async function sendLog(logData) {
  setImmediate(async () => {
    try {
      console.log('📊 Telemetry:', JSON.stringify(logData, null, 2))
      const url = getLogUrl()
      if (url) {
        const apiKey = getApiKey()
        await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(apiKey ? { 'x-api-key': apiKey } : {})
          },
          body: JSON.stringify(logData)
        })
      }
    } catch (err) {
      console.error('❌ Error sending log:', err)
    }
  })
}
module.exports = { sendLog }
