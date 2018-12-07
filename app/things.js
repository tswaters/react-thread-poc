
const {join} = require('path')
const serverFactory = require('./types/server')
const webworkerFactory = require('./types/webworker')
const napaFactory = require('./types/napajs')
const workerFarmFactory = require('./types/worker-farm')
const workerPoolFactory = require('./types/worker-pool')
const workerThreadFactory = require('./types/worker-thread')

module.exports = {
  server: {
    factory: serverFactory.factory,
    close: serverFactory.close,
    entry: join(__dirname, '../dist/server/main.js')
  },
  webworker: {
    factory: webworkerFactory.factory,
    close: webworkerFactory.close,
    entry: join(__dirname, '../dist/webworker/main.js')
  },
  workerFarm: {
    factory: workerFarmFactory.factory,
    close: workerFarmFactory.close,
    entry: join(__dirname, '../dist/worker-farm/main.js')
  },
  workerPool: {
    factory: workerPoolFactory.factory,
    close: workerPoolFactory.close,
    entry: join(__dirname, '../dist/worker-pool/main.js')
  },
  napajs: {
    factory: napaFactory.factory,
    close: napaFactory.close,
    entry: join(__dirname, '../dist/napajs/main.js')
  },
  workerThread: {
    factory: workerThreadFactory.factory,
    close: workerThreadFactory.close,
    entry: join(__dirname, '../dist/worker-thread/main.js')
  }
}
