
const threads = require('webworker-threads')

exports.factory = entry => {

  const thread = threads.create()
  thread.load(entry)

  return async state => {
    return new Promise((resolve, reject) =>
      thread.eval(`app.render(${JSON.stringify(state)})`, (err, result) =>
        setImmediate(() => err ? reject(err) : resolve(result))
    ))
  }

}

exports.close = () => {}
