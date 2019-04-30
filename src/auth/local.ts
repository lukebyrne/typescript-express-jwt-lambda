// As per https://medium.com/@muravitskiy.mail/cannot-redeclare-block-scoped-variable-varname-how-to-fix-b1c3d9cc8206
export {}
import express = require('express')
const router = express.Router()
import passport = require('passport')
import { knex } from '../knex'
import { hashPassword, generateJWT, comparePassword } from './localFunctions'
import { typeUser, typeRoles, typeRole } from './localTypes'
const LocalStrategy = require('passport-local').Strategy

const options: { usernameField: string; passwordField: string } = {
  usernameField: 'email',
  passwordField: 'password',
}

passport.use(
  new LocalStrategy(
    options,
    (email: string, password: string, done: Function): void => {
      knex.from('users').where({ email }).first()
      .then((user: typeUser) => {
        if (user) {
          if (comparePassword(password, user.password)) {
            console.log('Success, we are logged in!')
            return done(null, user)
          } else {
            console.log('Passwords dont match')
            return done(null, false)
          }
        } else {
          console.log('No user with that email')
          return done(null, false)
        }
      })
      .catch((err) => {
        console.error(err)
        return done(null, false)
      })
    }
  )
)

// curl --header "Content-Type: application/json" --request POST --data '{ "email": "me@lukebyrne.com", "password": "abcd1234" }' http://localhost:4000/api/user/register
router.post(
  '/register',
  (req: express.Request, res: express.Response): void => {
    const body: any = req.body
    const email: string = body.email
    const password: string = body.password

    knex('users').where({ email }).first()
    .then((user: typeUser) => {
      if (user) {
        res.status(500).send('Email already exists')
      } else {
        const insertUser = {
          email,
          password: hashPassword(password),
        }
        knex('users').insert(insertUser).returning(['id', 'email'])
        .then((user: typeUser) => {
          res.send(user)
        })
        .catch((err) => {
          console.error(err)
          res.status(500).send(err)
        })
      }
    })
    .catch((err) => {
      console.error(err)
      res.status(500).send(err)
    })
  }
)

router.get('/failure', (res: express.Response
): void => {
  res.send('failure')
})

// curl --header "Content-Type: application/json" --request POST --data '{ "email": "me@lukebyrne.com", "password": "abcd1234" }' http://localhost:4000/api/user/login
router.post(
  '/login',
  passport.authenticate('local', {
    failureRedirect: '/api/user/failure',
    // successRedirect: '/api/jwt/set',
  }), (req: express.Request, res: express.Response): void => {
    knex.select('name').from('roles')
    .leftJoin('users_roles', 'roles.id', 'users_roles.role_id')
    .where({ 'users_roles.user_id': req.user.id })
    .then((roles: typeRoles) => {
      const rolesArray: string[] = roles.map((role: typeRole) => {
        return role.name
      })
      const jwt: string = generateJWT(
        req.user.id,
        req.user.email,
        rolesArray,
      )
      res.setHeader('Content-Type', 'application/json')
      res.send(JSON.stringify({ jwt }))
    })
    .catch((err) => {
      console.error(err)
      res.status(500).send(err)
    })
  }
)

module.exports = router
