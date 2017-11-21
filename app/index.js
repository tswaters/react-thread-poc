require('segfault-handler').registerHandler('crash.log')

const PORT = 3000

const path = require('path')
const express = require('express')
const uuid = require('uuid')

const getPage = (title, html, state) => `
  <html>
  <head>
  <title>${title}</title>
  <meta charset="utf-8">
  </head>
  <body>
  <div id="root">${html}</div>
  <script>window.LOCALS = ${JSON.stringify(state)}</script>
  <script src="/vendor.js"></script>
  <script src="/main.js"></script>
  </body>
  </html>
`

const thread = require('./worker')('./dist/thread/main.js')
const {render: server} = require('../dist/server/main')

const app = express()
app.use(express.static(path.join(__dirname, '../dist/client')))

app.get('/server/:count', (req, res) => {
  const count = req.params.count
  const transaction = uuid.v4()
  const title = `server (${count}) ${transaction}`
  const state = {isReact: true, count}
  console.time(title)
  try {
    const html = server(state)
    res.status(200).end(getPage(title, html, state))
  } catch (err) {
    res.status(500).end(err.message)
  } finally {
    console.timeEnd(title)
  }
})

app.get('/thread/:count', async (req, res) => {
  const count = req.params.count
  const transaction = uuid.v4()
  const title = `thread (${count}) ${transaction}`
  const state = {isReact: true, count}
  console.time(title)
  try {
    const html = await thread(state)
    res.status(200).end(getPage(title, html, state))
  } catch (err) {
    res.status(500).end(err.message)
  } finally {
    console.timeEnd(title)
  }
})

app.listen(PORT, () => {
  console.log(`listening on ${PORT}`)
})
