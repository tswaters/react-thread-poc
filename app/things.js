
const {join} = require('path')
const betterThreadFactory = require('./types/betterthread')
const serverFactory = require('./types/server')
const webworkerThreadsFactory = require('./types/webworker-threads')
const napaFactory = require('./types/napajs')
const workerFarmFactory = require('./types/worker-farm')
const workerPoolFactory = require('./types/workerpool')
const workerThreadsFactory = require('./types/worker_threads')

module.exports = {
  server: {
    factory: serverFactory.factory,
    close: serverFactory.close,
    entry: join(__dirname, '../dist/server/main.js')
  },
  betterthread: {
    factory: betterThreadFactory.factory,
    close: betterThreadFactory.close,
    entry: join(__dirname, '../dist/server/main.js')
  },
  'webworker-threads': {
    factory: webworkerThreadsFactory.factory,
    close: webworkerThreadsFactory.close,
    entry: join(__dirname, '../dist/webworker-threads/main.js')
  },
  'worker-farm': {
    factory: workerFarmFactory.factory,
    close: workerFarmFactory.close,
    entry: join(__dirname, '../dist/worker-farm/main.js')
  },
  workerpool: {
    factory: workerPoolFactory.factory,
    close: workerPoolFactory.close,
    entry: join(__dirname, '../dist/workerpool/main.js')
  },
  napajs: {
    factory: napaFactory.factory,
    close: napaFactory.close,
    entry: join(__dirname, '../dist/napajs/main.js')
  },
  'worker_threads': {
    factory: workerThreadsFactory.factory,
    close: workerThreadsFactory.close,
    entry: join(__dirname, '../dist/worker_threads/main.js')
  }
}
