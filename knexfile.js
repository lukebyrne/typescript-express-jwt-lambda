module.exports = {
  development: {
    client: 'pg',
    connection: 'postgres://localhost/typescript-express-jwt-lambda',
    migrations: {
      directory: './db/migrations'
    },
    useNullAsDefault: true
  },
  test: {
    client: 'pg',
    connection: 'postgres://localhost/typescript-express-jwt-lambda-test',
    migrations: {
      directory: './db/migrations'
    },
    useNullAsDefault: true
  },
  production: {
    client: 'pg',
    connection: 'postgresql://deploy:deletemesoon@typescript-express-jwt-lambda.cwrvwdxpik9v.us-west-2.rds.amazonaws.com/jwt',
    migrations: {
      directory: './db/migrations'
    },
    useNullAsDefault: true
  }


}
