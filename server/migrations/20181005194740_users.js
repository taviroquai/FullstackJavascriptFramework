
exports.up = function(knex, Promise) {
  return knex.schema.createTable('users', table => {
      table.increments('id').primary();
      table.string('username').unique();
      table.string('email').unique();
      table.string('password');
      table.string('authtoken');
      table.string('avatar');
      table.boolean('active').default(false);

      // Role relation
      table.integer('role_id').unsigned()
        .references('id')
        .inTable('roles')
        .onDelete('SET NULL');
    });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTableIfExists('users');
};
