require('dotenv').config()
import express = require('express')
import session = require('express-session')
import bodyParser = require('body-parser')
import passport = require('passport')

const app = express()

passport.serializeUser((user, done) => {
  done(null, user)
})

passport.deserializeUser((user, done) => {
  done(null, user)
})

app.use(
  session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true,
  }),
)

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(passport.initialize())
app.use(passport.session())

app.get('/', (req: express.Request, res: express.Response) => {
  res.send('Express Passport API')
})

app.use('/api/user', require('./auth/local'))

export default app
