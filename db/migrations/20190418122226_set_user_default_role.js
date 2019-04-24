
const multiline = require('multiline')

const query = multiline.stripIndent(function () {/*
  DROP TRIGGER IF EXISTS add_role_on_user_create on users;
  DROP FUNCTION IF EXISTS add_role_on_user_create();
  CREATE FUNCTION add_role_on_user_create() RETURNS trigger AS '
    BEGIN
      INSERT INTO users_roles(user_id, role_id) VALUES (NEW.id, 1);
        RETURN NEW;
    END;
  '
  LANGUAGE plpgsql;
  CREATE TRIGGER add_role_on_user_create AFTER INSERT ON users FOR EACH ROW EXECUTE PROCEDURE add_role_on_user_create();
*/});

exports.up = (knex, Promise) => {
  return Promise.all([
    knex('roles').insert([
      { name: 'user' },
      { name: 'admin' }
    ]),

    knex.raw(query)
  ])
}

exports.down = (knex, Promise) => {

}
