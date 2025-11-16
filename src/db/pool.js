const { Pool } = require('pg')

exports.pool = new Pool({
    connectionString: process.env.DBURL
})
