// As per https://medium.com/@muravitskiy.mail/cannot-redeclare-block-scoped-variable-varname-how-to-fix-b1c3d9cc8206
export {}
import express = require('express')
const router = express.Router()
import passport = require('passport')
import { knex } from '../knex'
import { handleSignin, handleRegister, signInUser } from './localFunctions'
const LocalStrategy = require('passport-local').Strategy

const options: { usernameField: string; passwordField: string } = {
  usernameField: 'email',
  passwordField: 'password',
}

import { typeUser } from './localTypes'

passport.use(
  new LocalStrategy(
    options,
    (email: string, password: string, done: Function): void => {
      const signInUserFunc = async () => {
        try {
          const user: typeUser = await knex
            .from('users')
            .where({ email })
            .first()
          handleSignin(password, user, done)
        } catch (err) {
          console.error(err)
          return done(null, false)
        }
      }
      signInUserFunc()
    },
  ),
)


// curl --header "Content-Type: application/json" --request POST --data '{ "email": "me@lukebyrne.com", "password": "abcd1234" }' http://localhost:4000/api/user/register
router.post(
  '/register',
  (req: express.Request, res: express.Response): void => {
    console.log('--- REGISTER ---')
    const body: any = req.body
    const email: string = body.email
    const password: string = body.password

    const register = async () => {
      try {
        const user: typeUser = await knex('users')
          .where({ email })
          .first()
        handleRegister(user, email, password, res)
      } catch (err) {
        console.error(err)
        res.status(500).send(err)
      }
    }
    register()
  },
)

router.get('/failure', (
  req: express.Request,
  res: express.Response,
): void => {
  console.error('--- FAILURE ---')
  res.send('failure')
})

// curl --header "Content-Type: application/json" --request POST --data '{ "email": "me@lukebyrne.com", "password": "abcd1234" }' http://localhost:4000/api/user/login
router.post(
  '/login',
  passport.authenticate('local', {
    failureRedirect: '/api/user/failure',
    // successRedirect: '/api/jwt/set',
  }), (req: express.Request, res: express.Response): void => {
    console.log('--- LOGIN ---')
    signInUser(req, res)
  }
)

module.exports = router
