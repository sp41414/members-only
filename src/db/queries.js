const { pool } = require("./pool");

const insertUser = async (user, password, salt) => {
  await pool.query(
    "INSERT INTO users (username, hash, salt, membership) VALUES ($1, $2, $3, FALSE);",
    [user, password, salt]
  );
};

const checkUser = async (username) => {
  const { rows } = await pool.query("SELECT * FROM users WHERE username=$1", [
    username,
  ]);
  if (rows.length > 0) {
    return true;
  }
  return false;
};

const fetchMessages = async () => {
  const { rows } = await pool.query(
    "SELECT * FROM message WHERE membership=FALSE ORDER BY timestamp"
  );
  return rows;
};
const fetchMembershipMessages = async () => {
  const { rows } = await pool.query(
    "SELECT * FROM message WHERE membership=TRUE ORDER BY timestamp"
  );
  return rows;
};
const createMessage = async (author, title, text, membership) => {
  await pool.query(
    "INSERT INTO message (title, text, timestamp, author, membership) VALUES ($1, $2, NOW(), $3, $4);",
    [title, text, author, membership]
  );
};

const updateMembership = async (id, membership) => {
  await pool.query("UPDATE users SET membership=$1 WHERE id=$2", [
    membership,
    id,
  ]);
};

const fetchAllMessagesAdmin = async () => {
  const { rows } = await pool.query("SELECT * FROM message ORDER BY timestamp");
  return rows;
};

const updateMessage = async (id, title, text) => {
  await pool.query("UPDATE message SET title=$1, text=$2 WHERE id=$3", [
    title,
    text,
    id,
  ]);
};

const deleteMessage = async (id) => {
  await pool.query("DELETE FROM message WHERE id=$1", [id]);
};

module.exports = {
  insertUser,
  checkUser,
  fetchMessages,
  fetchMembershipMessages,
  createMessage,
  updateMembership,
  fetchAllMessagesAdmin,
  updateMessage,
  deleteMessage,
};
