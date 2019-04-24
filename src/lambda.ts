import app from './app'
import serverless = require('serverless-http')
module.exports.handler = serverless(app)