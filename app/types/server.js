exports.factory = entry => {

  const {render} = require(entry)

  return async state => new Promise((resolve, reject) => setImmediate(() => {
    try {
      const result = render(state)
      resolve(result)
    } catch (err) {
      reject(err)
    }
  }))
}

exports.close = () => {}
