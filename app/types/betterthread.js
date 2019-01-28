'use strict'

const workers = require('os').cpus().length
const {createPool} = require('generic-pool')
const bt = require('betterthread')

let pool = null

exports.factory = async () => {

  pool = createPool({
    create: () => new bt.ThreadedFunction((message, done) => {
      const {join} = require('path')
      const {render} = require(join(process.cwd(), 'dist/server/main.js'))
      done(render(message))
    }),
    destroy: (thread) => thread.kill()
  }, {min: 1, max: workers})

  return async state => {
    const thread = await pool.acquire()
    return new Promise((resolve, reject) => {
      const done = stuff => { resolve(stuff); clean() }
      const error = err => { reject(err); clean() }
      const clean = () => {
        pool.release(thread)
        thread.off('data', done)
        thread.off('error', error)
      }
      thread.once('data', done)
      thread.once('error', error)
      thread.send(state)
    })
  }
}

exports.close = async () => {
  await pool.drain()
  await pool.clear()
}
