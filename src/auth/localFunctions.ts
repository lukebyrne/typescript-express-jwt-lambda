// As per https://medium.com/@muravitskiy.mail/cannot-redeclare-block-scoped-variable-varname-how-to-fix-b1c3d9cc8206
export {}
import jwt = require('jsonwebtoken')
import { privateKey } from './private_key'
import { publicKey } from './public_key'
import bcrypt = require('bcrypt-nodejs')
import { typeClaims } from './localTypes'

export const hashPassword = (password: string): string => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10))
}

export const comparePassword = (password: string, hash: string): boolean => {
  return bcrypt.compareSync(password, hash)
}

export const generateJWT = (
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
