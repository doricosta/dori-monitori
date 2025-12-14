const { routeWrapper } = require('./routeWrapper')
const { sendTrace } = require('./tracer')
const { setLogUrl, getLogUrl, setTraceUrl, getTraceUrl, setApiKey, getApiKey, shouldLogResponses } = require('./config')
const dm_middleware = { routeWrapper, sendTrace, setLogUrl, getLogUrl, setTraceUrl, getTraceUrl, setApiKey, getApiKey, shouldLogResponses }
module.exports = { dm_middleware, routeWrapper, sendTrace, setLogUrl, getLogUrl, setTraceUrl, getTraceUrl, setApiKey, getApiKey, shouldLogResponses }
