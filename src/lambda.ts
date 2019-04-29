import app from './app'
import serverless = require('serverless-http')
export const handler = serverless(app)
