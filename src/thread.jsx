
import React from 'react'
import {renderToString} from 'react-dom/server'

import App from './components/App'

const app = React.createFactory(App)

export const render = (context, cb) => {
  try {
    const vdom = app(context)
    const html = renderToString(vdom)
    return cb(null, html)
  } catch (err) {
    cb(err)
  }
}
