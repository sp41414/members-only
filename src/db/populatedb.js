require('dotenv').config()
const { Pool } = require('pg')

// source for sessions table: https://github.com/voxpelli/node-connect-pg-simple/blob/HEAD/table.sql
const SQL = `
    CREATE TABLE users (id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY, username VARCHAR, hash VARCHAR, salt VARCHAR, membership BOOLEAN, admin BOOLEAN);

    CREATE TABLE message (id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY, title VARCHAR, text VARCHAR, timestamp TIMESTAMP, author VARCHAR, membership BOOLEAN);

    CREATE TABLE "sessions" (
	  "sid" varchar NOT NULL COLLATE "default",
	  "sess" json NOT NULL,
	  "expire" timestamp(6) NOT NULL
	)
	WITH (OIDS=FALSE);

	ALTER TABLE "sessions" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;

	CREATE INDEX "IDX_session_expire" ON "sessions" ("expire");
`;


async function main() {
    const pool = new Pool({
        connectionString: process.env.DBURL
    })
    const client = await pool.connect()
    try {
        await client.query(SQL)
    } catch (err) {
        console.error(err)
    } finally {
        client.release()
        await pool.end()
    }
}

main()
