
const workerFarm = require('worker-farm')

let workers = null

exports.factory = entry => {
  workers = workerFarm({autoStart: true}, require.resolve(entry), ['render'])
  return async state => new Promise((resolve, reject) => setImmediate(() =>
    workers.render(state, (err, result) => err ? reject(err) : resolve(result))
  ))
}

exports.close = () => new Promise(resolve => workerFarm.end(workers, resolve))
