const {LOG_LEVEL = 'silent'} = process.env
const pino = require('pino')
module.exports = pino({level: LOG_LEVEL})
