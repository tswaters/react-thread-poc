const PORT = 3000
const http = require('http')
const logger = require('./lib/logger')
const App = require('./app')
const things = require('./things')

;(async () => {

  const connections = {}

  const app = await App()
  const server = http.createServer(app)

  server.listen(PORT, () => logger.info(`listening on ${PORT}`))

  server.on('connection', conn => {
    const id = conn.remoteAddress + ':' + conn.remotePort
    connections[id] = conn
    conn.on('close', () => delete connections[id])
  })

  process.on('SIGTERM', () => close())
  process.on('SIGINT', () => close())

  async function close () {
    logger.info('closing server')

    for (let key in connections) connections[key].destroy()

    for (let key in things) await things[key].close()

    server.close(() => {
      logger.info('done closing')
      process.exit(0)
    })

  }
})()
.catch(err => {
  console.log(err)
  logger.fatal(err)
  process.exit(1)
})
