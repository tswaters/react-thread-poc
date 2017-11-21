
import React from 'react'
import {hydrate} from 'react-dom'

import App from './components/App'

const app = (
  <App {...window.LOCALS} />
)

hydrate(app, document.getElementById('root'))
