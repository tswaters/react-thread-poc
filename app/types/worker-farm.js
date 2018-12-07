
const workerFarm = require('worker-farm')

let workers = null

exports.factory = entry => {
  workers = workerFarm({autoStart: true}, require.resolve(entry), ['render'])
  return async state => {
    return new Promise((resolve, reject) =>
      workers.render(state, (err, result) =>
        setImmediate(() => err ? reject(err) : resolve(result)))
    )
  }
}

exports.close = () => new Promise(resolve => workerFarm.end(workers, resolve))
