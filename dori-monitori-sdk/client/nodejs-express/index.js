const { routeWrapper } = require('./routeWrapper')
const { queueWrapper } = require('./queueWrapper')
const { sendTrace } = require('./tracer')
const { setLogUrl, getLogUrl, setTraceUrl, getTraceUrl, setApiKey, getApiKey, shouldLogResponses } = require('./config')
const dm_middleware = { routeWrapper, queueWrapper, sendTrace, setLogUrl, getLogUrl, setTraceUrl, getTraceUrl, setApiKey, getApiKey, shouldLogResponses }
module.exports = { dm_middleware, routeWrapper, queueWrapper, sendTrace, setLogUrl, getLogUrl, setTraceUrl, getTraceUrl, setApiKey, getApiKey, shouldLogResponses }
