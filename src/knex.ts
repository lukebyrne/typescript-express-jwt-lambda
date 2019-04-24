export const knex = require('knex')({
  client: 'pg',
  connection:
    process.env.NODE_ENV !== 'test'
      ? process.env.DATABASE_URL
      : process.env.TEST_DATABASE_URL,
})