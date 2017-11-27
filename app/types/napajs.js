
const {promisify} = require('util')
const napa = require('napajs')
const {readFile: _readFile} = require('fs')
const workers = require('os').cpus().length

const readFile = promisify(_readFile)

module.exports = async entry => {

  const zone1 = napa.zone.create('zone1', {workers})

  const script = await readFile(entry)
  await zone1.broadcast(script.toString())

  return async state => {
    try {
      const result = await zone1.execute('', 'app.render', [state])
      return result.value
    } catch (err) {
      throw new Error(err)
    }
  }
}
