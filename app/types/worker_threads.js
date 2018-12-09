const {TextDecoder} = require('util')
const {createPool} = require('generic-pool')
const {Worker, MessageChannel} = require('worker_threads')
const workers = require('os').cpus().length

let pool = null

exports.factory = async (entry) => {

  pool = createPool({
    create: () => new Worker(entry),
    destroy: (thread) => new Promise(resolve => thread.terminate(resolve))
  }, {min: 1, max: workers})

  return async state => {

    const worker = await pool.acquire()
    const decoder = new TextDecoder()

    return new Promise((resolve, reject) => setImmediate(() => {

      const {port1, port2: port} = new MessageChannel()

      port1.once('message', ({result, error}) => {
        if (error) { return reject(error) }
        resolve(decoder.decode(result))
      })

      worker.postMessage({port, ...state}, [port])
      pool.release(worker)

    }))

  }

}

exports.close = async () => {
  await pool.drain()
  await pool.clear()
}
