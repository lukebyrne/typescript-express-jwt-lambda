import app from './app'
const request = require('supertest')

const knex = require('knex')({
  client: 'pg',
  connection: process.env.TEST_DATABASE_URL,
  migrations: {
    directory: './db/migrations',
  },
})

describe('routes : auth', () => {
  beforeEach(async done => {
    await knex.raw('TRUNCATE users CASCADE; TRUNCATE users_roles CASCADE;')
    done()
  })

  describe('GET / - a simple api endpoint', () => {
    it('Express Passport API', async () => {
      const result = await request(app).get('/')
      expect(result.text).toEqual('Express Passport API')
      expect(result.statusCode).toEqual(200)
    })
  })

  describe('POST /register', () => {
    it('registers a new user', async () => {
      const result = await request(app)
        .post('/api/user/register')
        .send({
          email: 'me@lukebyrne.com',
          password: 'abcd1234',
        })
      expect(result.statusCode).toEqual(200)
    })

    it('registers a new user, fails to register again with the same email', async () => {
      let result = await request(app)
        .post('/api/user/register')
        .send({
          email: 'me@lukebyrne.com',
          password: 'abcd1234',
        })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
      expect(result.statusCode).toEqual(200)

      result = await request(app)
        .post('/api/user/register')
        .send({
          email: 'me@lukebyrne.com',
          password: '1234abcd',
        })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
      expect(result.statusCode).toEqual(500)
    })
  })

  describe('POST /register & /login', () => {
    it('create a new user and logins', async () => {
      let result = await request(app)
        .post('/api/user/register')
        .send({
          email: 'me@lukebyrne.com',
          password: 'abcd1234',
        })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
      expect(result.statusCode).toEqual(200)

      result = await request(app)
        .post('/api/user/login')
        .send({
          email: 'me@lukebyrne.com',
          password: 'abcd1234',
        })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
      expect(result.statusCode).toEqual(200)
    })
  })

  describe('POST /register & /login with wrong email', () => {
    it('create a new user and fails to login', async () => {
      let result = await request(app)
        .post('/api/user/register')
        .send({
          email: 'me@lukebyrne.com',
          password: 'abcd1234',
        })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
      expect(result.statusCode).toEqual(200)

      result = await request(app)
        .post('/api/user/login')
        .send({
          email: 'me@lukebyrne1.com',
          password: 'abcd1234',
        })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
      // Redirects us to the failure
      expect(result.statusCode).toEqual(302)
    })
  })

  describe('POST /register & /login with wrong password', () => {
    it('create a new user and fails to login', async () => {
      let result = await request(app)
        .post('/api/user/register')
        .send({
          email: 'me@lukebyrne.com',
          password: 'abcd1234',
        })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
      expect(result.statusCode).toEqual(200)

      result = await request(app)
        .post('/api/user/login')
        .send({
          email: 'me@lukebyrne.com',
          password: 'abcd123',
        })
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json')
      // Redirects us to the failure
      expect(result.statusCode).toEqual(302)
    })
  })
})
