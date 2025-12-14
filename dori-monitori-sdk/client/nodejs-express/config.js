let logUrl = process.env.DORI_MONITORI_LOG_URL || process.env.DM_LOG_URL || null
let traceUrl = process.env.DORI_MONITORI_TRACE_URL || process.env.DM_TRACE_URL || null
let apiKey = process.env.DORI_MONITORI_API_KEY || process.env.DM_API_KEY || null
function setLogUrl(url) {
  logUrl = url || null
}
function getLogUrl() {
  return logUrl
}
function setTraceUrl(url) {
  traceUrl = url || null
}
function getTraceUrl() {
  return traceUrl
}
function setApiKey(key) {
  apiKey = key || null
}
function getApiKey() {
  return apiKey
}
function shouldLogResponses() {
  return String(process.env.LOG_RESPONSES).toLowerCase() === 'true' || String(process.env.DORI_MONITORI_LOG_RESPONSES).toLowerCase() === 'true'
}
module.exports = { setLogUrl, getLogUrl, setTraceUrl, getTraceUrl, setApiKey, getApiKey, shouldLogResponses }
