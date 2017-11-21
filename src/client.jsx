
import React from 'react'
import {render} from 'react-dom'

import App from './components/App'

const app = (
  <App {...window.LOCALS} />
)

render(app, document.getElementById('root'))
