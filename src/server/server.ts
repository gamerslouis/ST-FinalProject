import express from 'express'
import { webpack } from 'webpack'
import wdm from 'webpack-dev-middleware'

const webpackConfig = require('../../webpack.dev')

const app = express()
app.use(express.static('public'))

if (process.env.NODE_ENV === 'development') {
  // Setup Webpack for development
  const compiler = webpack(webpackConfig)
  app.use(wdm(compiler))
} else {
  // Static serve the dist/ folder in production
  app.use(express.static('dist'))
}

export default app
