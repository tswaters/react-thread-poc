
const workerFarm = require('worker-farm')
const {join} = require('path')
const threads = require('webworker-threads')

module.exports = entry => {
  const workers = workerFarm({autoStart: true}, require.resolve(entry), ['render'])
  return async state => {
    return new Promise((resolve, reject) =>
      workers.render(state, (err, result) =>
        setImmediate(() => err ? reject(err) : resolve(result)))
    )
  }
}
