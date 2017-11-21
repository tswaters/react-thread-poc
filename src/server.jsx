
import React from 'react'
import {renderToString} from 'react-dom/server'

import App from './components/App'

const app = React.createFactory(App)

export const render = context => {
  const vdom = app(context)
  const html = renderToString(vdom)
  return html
}
