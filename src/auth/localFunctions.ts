// As per https://medium.com/@muravitskiy.mail/cannot-redeclare-block-scoped-variable-varname-how-to-fix-b1c3d9cc8206
export {}
import express = require('express')
import jwt = require('jsonwebtoken')
import { knex } from '../knex'
import { privateKey } from './private_key'
import { publicKey } from './public_key'
import bcrypt = require('bcrypt-nodejs')
import {
  typeUser,
  typeClaims,
  typeRoles,
  typeRole
} from './localTypes'

const hashPassword = (password: string): string => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10))
}

export const handleRegister = (
  user: typeUser,
  email: string,
  password: string,
  res: express.Response,
): void => {
  // Email exists
  if (user) {
    res.status(500).send('Email already exists')
  } else {
    const createUser = async () => {
      try {
        const insertUser = {
          email,
          password: hashPassword(password),
        }
        const user: typeUser = await knex('users')
          .insert(insertUser)
          .returning(['id', 'email'])
        res.send(user)
      } catch (err) {
        console.error(err)
        res.status(500).send(err)
      }
    }
    createUser()
  }
}

const comparePassword = (password: string, hash: string): boolean => {
  return bcrypt.compareSync(password, hash)
}

export const handleSignin = (
  password: string,
  user: typeUser,
  done: Function,
): Function => {
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
}

const generateJWT = (
  userId: number,
  email: string,
  rolesArray: string[],
): string => {
  const claims: typeClaims = {
    sub: `${userId}`,
    email
  }
  const token: string = jwt.sign(claims, privateKey, { algorithm: 'RS256' })
  const decoded: any = jwt.verify(token, publicKey)
  console.log(decoded)
  return token
}

export const signInUser = async (req: express.Request, res: express.Response) => {
  try {
    const roles: typeRoles = await knex
      .select('name')
      .from('roles')
      .leftJoin('users_roles', 'roles.id', 'users_roles.role_id')
      .where({ 'users_roles.user_id': req.user.id })

    const rolesArray: string[] = roles.map((role: typeRole) => {
      return role.name
    })

    const jwt: string = await generateJWT(
      req.user.id,
      req.user.email,
      rolesArray,
    )

    res.setHeader('Content-Type', 'application/json')
    res.send(JSON.stringify({ jwt }))
  } catch (err) {
    console.error(err)
    res.status(500).send(err)
  }
}
