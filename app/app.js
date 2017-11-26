
'use strict'

const {join} = require('path')
const express = require('express')
const uuid = require('uuid')

const serverFactory = require('./types/server')
const webworkerFactory = require('./types/webworker')
const napaFactory = require('./types/napajs')

const things = {
  server: {
    factory: serverFactory,
    entry: join(__dirname, '../dist/server/main.js')
  },
  webworker: {
    factory: webworkerFactory,
    entry: join(__dirname, '../dist/webworker/main.js')
  },
  napajs: {
    factory: napaFactory,
    entry: join(__dirname, '../dist/napajs/main.js')
  }
}

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
</html>`

module.exports = async () => {

  const app = express()

  app.use(express.static(join(__dirname, '../dist/client')))

  for (const [thing, {factory, entry}] of Object.entries(things)) {

    const worker = await factory(entry)

    console.log(`addding GET /${thing}/:count`)
    app.get(`/${thing}/:count`, async (req, res) => {
      const count = req.params.count
      const transaction = uuid.v4()
      const title = `${thing} (${count})`
      const state = {isReact: true, count}
      console.time(title)
      try {
        const html = await worker(state)
        res.status(200).end(getPage(title, html, state))
      } catch (err) {
        res.status(500).end(err)
      } finally {
        console.timeEnd(title)
      }
    })

  }

  return app
}
