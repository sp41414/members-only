const { pool } = require('./pool')

const insertUser = async (user, password, salt) => {
    await pool.query("INSERT INTO users (username, hash, salt, membership) VALUES ($1, $2, $3, FALSE);", [user, password, salt])
}

const checkUser = async (username) => {
    const { rows } = await pool.query("SELECT * FROM users WHERE username=$1", [username])
    if (rows.length > 0) {
        return true
    }
    return false
}

module.exports = {
    insertUser,
    checkUser
}
