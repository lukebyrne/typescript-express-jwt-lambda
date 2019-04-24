## typescript-express-jwt-lambda

This is a boilerplate app that provides a register/login endpoint on AWS Lambda via the Serverless.com framework.

Its sole puprose is to provide the ability to:

1. Create an account via `/api/user/register`
2. Provide the username/password from above to `/api/user/login` to receive asureley signed JWT token.

### To setup

1. Download this repo
2. Run `yarn` inside the app folder to install dependancies
3. Setup your local database (postgres command provided) via `createdb typescript-express-jwt-lambda`
4. Setup your local TEST database (postgres command provided) via `createdb typescript-express-jwt-lambda-test`
5. Update the file `knexfile.js` with the names of your newly created databases
6. Run `knex migrate:latest` & `knex migrate:latest --env=test` to setup your databases
7. Create you own versions of `src/auth/private_key.ts` and `src/auth/public_key.ts` like so:
  - Change into the `src/auth/` directory and run `ssh-keygen -t rsa -b 4096 -m PEM -f jwtRS256.key`
  - Run `openssl rsa -in jwtRS256.key -pubout -outform PEM -out jwtRS256.key.pub`
  - Run `/usr/bin/env ruby -e 'p ARGF.read' jwtRS256.key` and copy the output into `src/auth/private_key.ts` minus the double quotation marks from the string
  - Run `/usr/bin/env ruby -e 'p ARGF.read' jwtRS256.key.pub` and copy the output into `src/auth/public_key.ts` minus the double quotation marks from the string
8. Run the tests to make sure that everything is working via `yarn testwatch`

## To use locally

You either fire up the app via `yarn dev` or via `sls offline`.

The `sls offline` command will run the app as if its deployed to AWS Lambda and so runs webpack first. It will also use the `DATABASE_URL`  from the `serverless.yml` file.

### Register an account
```
curl --header "Content-Type: application/json" --request POST --data '{ "email": "test@email.com", "password": "abcd1234" }' http://localhost:4000/api/user/register
```

returns

```
[
  {
    "id": 1,
    "email": "test@email.com"
  }
]
```

### Get a JWT
```
curl --header "Content-Type: application/json" --request POST --data '{ "email": "test@email.com", "password": "abcd1234" }' http://localhost:4000/api/user/login
```

returns

```
{
  "jwt": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoidGVzdEBlbWFpbC5jb20iLCJpYXQiOjE1NTYwNzA2ODN9.Cg---BwIC42zG1rBxMpWNgCWb0aa9qmp-1vqQHpAq6Lg_da8kYCKvqwJEtuKk9Kni4phIGU7b0Mj977B0cHdvIu-vA2RHKMIEwWcrMl9dUhX0GqeiF92ruygtlbifLANYRSxQAIxuERI97xE6RgsGMzTf63Fi9pllWwucyamdVSVoPNACVP80JhGhxp-KU9dCgNCrXLTPXPfd9zJmbMdtmMpTLv42Qlvpzq7FTAbOahcxgy8N1h9NjErVs60jkqxSaJeY7EuajZwH0V6SWjreBJPlSeabrOKU5IozrqjXvRe1o--cHdtcB4lWfg7dVIvFDzQonLu0cp63aSua0Da6RHsfZslQiU-o0WyVIn-RYFeJxnuT_qcrzV_cABQjfFCJGyMSsBHtVRXfCn3nz9g18-n7xcgo8dzpyhOtoDTRHr34JgZe6U0REA64pfJHHJx4mJrLzfz-CyHPWzfNEBK4L2INMcorVXvWPufa9E4sicldNhHmLGtOb_BDOWnYGZgfk5E3gE7Ae9UpGIbGmIlmdbWLb9WmuC2ZvDhkvnHjmI2nFbhd_7-V7TdsUmUEYF2k5OPhKRnuHkHLlM6fSvVewvASBZXqjfHWvnbLYNSNnp_C-ZkG21bLVA7zK3Ome_DJKy0W_xgym6cvLmEtQCswj7xouBtOrxdjD-B3hl3XFQ"
}
```

which can be decoded by pasting the jwt into jwt.io, which shows:

```
{
  "sub": 1,
  "email": "test@email.com",
  "iat": 1556070683
}
```

### To deploy

1. Setup an Postgres RDS (or any provider/postgres|myqsl db combo that you like)
2. Run the migrations via `knex migrate:latest --env=production`
3. Update the `serverless.yml` file with any changes you need
4. Run `sls deploy`
5. You are good to go!