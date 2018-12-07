const {LOG_LEVEL = 'debug'} = process.env
const pino = require('pino')
module.exports = pino({level: LOG_LEVEL})
