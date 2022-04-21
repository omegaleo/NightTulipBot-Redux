const { Pool } = require('pg');
const secrets = require('../config/secrets.js');
const pool = new Pool({
    connectionString: secrets.postgresConnectionString
});

pool.on('connect', () => {
    console.log('DB Connected!');
});

module.exports = {
    query: (text, params) => pool.query(text, params),
};