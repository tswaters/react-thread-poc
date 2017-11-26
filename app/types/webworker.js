
const {join} = require('path')
const threads = require('webworker-threads')

module.exports = entry => {

  const thread = threads.create()
  thread.load(entry)

  return async state => {
    return new Promise((resolve, reject) =>
      thread.eval(`app.render(${JSON.stringify(state)})`, (err, result) =>
        setImmediate(() => err ? reject(err) : resolve(result))
    ))
  }

}
