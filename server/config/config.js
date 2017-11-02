const { parsed: environmentVariables } = require('dotenv').config();

const environment = environmentVariables.NODE_ENV || 'development';
const dialect = 'postgres';
const url = environmentVariables.DATABASE_URL;
const devMode = environment === ('development' || 'test');


const config = {
  url,
  dialect,
  logging: devMode ? log => log : false,
  dialectOptions: {
    multipleStatements: true
  },
  host: '127.0.0.1',
  port: 5432,
  username: 'postgres',
  password: 'root',
};

if (!devMode) {
  config.ssl = true;
  config.dialectOptions.ssl = {
    require: !devMode
  };
}
module.exports = config;
