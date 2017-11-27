
const workerpool = require('workerpool')

module.exports = async entry => {

  const pool = workerpool.pool(entry);

  return async state => {
    return pool.exec('render', [state])
  }
}
