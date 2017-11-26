require('segfault-handler').registerHandler('crash.log')

const PORT = 3000
const App = require('./app')

App()
  .then(app => app.listen(PORT, () => console.log(`listening on ${PORT}`)))
  .catch(err => { console.error('problem initializing', err); process.exit(1) })
