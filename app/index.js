const PORT = 3000
const logger = require('./lib/logger')
const App = require('./app')

App()
  .then(app => app.listen(PORT, () => logger.info(`listening on ${PORT}`)))
  .catch(err => { logger.error('problem initializing', err); process.exit(1) })
