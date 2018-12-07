
'use strict'

const {join} = require('path')
const express = require('express')
const uuid = require('uuid')
const {performance} = require('perf_hooks');
const logger = require('./lib/logger')
const things = require('./things')

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

    logger.info(`addding GET /${thing}/:count`)
    app.get(`/${thing}/:count`, async (req, res, next) => {
      const start = performance.now()
      const count = req.params.count
      const transaction = uuid.v4()
      const title = `${transaction} ${thing} (${count})`
      const state = {isReact: true, count}
      try {
        const html = await worker(state)
        res.status(200).end(getPage(title, html, state))
      } catch (err) {
        next(err)
      } finally {
        logger.debug(title, performance.now() - start)
      }
    })

  }

  app.use((err, req, res, next) => {
    if (res.headersSent) { return next(err) }
    err = typeof err === 'string' ? new Error(err) : err
    console.error(err)
    res.status(500).end(err.message)
  })

  return app
}
