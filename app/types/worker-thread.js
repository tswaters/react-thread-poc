
const {TextDecoder} = require('util')
const {Worker, MessageChannel} = require('worker_threads')
const workers = require('os').cpus().length

exports.factory = async entry => {
  const pool = new ThreadPool(entry, workers)
  return state => pool.work(state)
}

// todo: is there a clean way to close this?
exports.close = () => {}

class ThreadPool {

  constructor (entry, num) {
    this.queue = []
    this.workers = []
    this.decoder = new TextDecoder()
    for (let i = 0; i < num; i++) {
      this.workers.push(new Worker(entry))
    }
  }

  work (task) {
    return new Promise((resolve, reject) => {
      this.queue.push({task, resolve, reject})
      this.do_work()
    })
  }

  do_work () {
    if (this.queue.length === 0 || this.workers.length === 0) {
      return
    }

    const worker = this.workers.shift()
    const {task, resolve, reject} = this.queue.shift()
    const {port1, port2: port} = new MessageChannel()

    port1.once('message', ({result, error}) => {
      if (error) { reject(error) }
      else { resolve(this.decoder.decode(result)) }
      this.workers.push(worker)
      this.do_work()
    })

    worker.postMessage({port, ...task}, [port])
  }

}
