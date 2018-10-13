// Load enviroment variables
require('dotenv').config();

// Require dependencies
const fs = require('fs');
const ModuleManager = require('./core/ModuleManager');
const GraphqlManager = require('./core/GraphqlManager');

// Update schema cache
const schema = ModuleManager.generateGraphqlSchema();
const filename = GraphqlManager.getCacheFilename();
fs.writeFileSync(filename, schema, 'utf-8');

// Send some acknoledge output
console.log('Schema cache updated:', filename);
