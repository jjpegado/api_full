const { Pool } = require('pg')

const pool = new Pool({
	host: 'localhost',
	port: 5432,
	user: 'postgres',
	password: '96102047',
	database: 'dindin',
})

module.exports = pool