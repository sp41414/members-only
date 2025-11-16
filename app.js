require('dotenv').config()
const express = require('express')
const session = require('express-session')
const { pool } = require('./src/db/pool')
const passport = require('./src/auth/passport')
const PORT = 3000

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(session({
    store: new (require("connect-pg-simple")(session))({
        pool: pool,
        tableName: "sessions",
    }),
    secret: process.env.secret,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 } // 1 month
}))

app.use(passport.session())

app.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`App listening on port ${PORT}`)
})
