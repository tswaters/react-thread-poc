
const workerpool = require('workerpool')

let pool = null

exports.factory = async entry => {

  pool = workerpool.pool(entry);

  return async state => {
    return pool.exec('render', [state])
  }
}

exports.close = () => pool.terminate()
