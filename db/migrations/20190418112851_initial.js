
exports.up = (knex, Promise) => {
  return Promise.all([
    knex.schema.createTable('users', (table) => {
      table.increments('id').primary()
      table.string('email').unique().notNullable()
      table.string('password').notNullable()
      table.timestamp('created_at').defaultTo(knex.raw('now()'))

    }),
    knex.schema.createTable('roles', (table) => {
      table.increments('id').primary()
      table.string('name').unique().notNullable()
    }),
    knex.schema.createTable('users_roles', (table) => {
      table.integer('user_id').unsigned().notNullable()
      table.foreign('user_id')
        .references('users.id')

      table.integer('role_id').unsigned().notNullable()
      table.foreign('role_id')
        .references('roles.id')
    })
  ])
}

exports.down = (knex, Promise) => {
  return Promise.all([
    knex.schema.dropTable('users'),
    knex.schema.dropTable('roles'),
    knex.schema.dropTable('users_roles')
  ])
}
