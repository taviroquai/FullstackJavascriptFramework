// run the following command to install:
// npm install objection knex sqlite3

const { Model } = require('objection');
const Knex = require('knex');
const knexfile = require('../knexfile');

// Initialize knex.
const key = process.env.FSTACK_KNEX_CONFIG_KEY;
const knex = Knex(knexfile[key]);

// Give the knex object to objection.
Model.knex(knex);

module.exports = Model;
