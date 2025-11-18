const db = require("../db/queries");

const signUpGet = (req, res) => {
  if (req.user) {
    return res.redirect("/");
  }
  res.render("signup", { title: "Sign Up" });
};

const homePage = async (req, res) => {
  const messages = await db.fetchMessages();
  const memberShipMessages = await db.fetchMembershipMessages();
  const allMessagesAdmin = await db.fetchAllMessagesAdmin();
  res.render("index", {
    title: "Members Only",
    user: req.user,
    messages: messages,
    memberShipMessages: memberShipMessages,
    allMessagesAdmin: allMessagesAdmin,
  });
};

const loginGet = (req, res) => {
  if (req.user) {
    return res.redirect("/");
  }
  res.render("login", { title: "Login" });
};

const loginFail = (req, res) => {
  if (req.user) {
    return res.redirect("/");
  }
  res.render("login-fail", { title: "Login" });
};

const newMessageGet = (req, res) => {
  if (!req.user) {
    res.redirect("/");
  }
  res.render("message", { title: "New Message" });
};

const membershipGet = (req, res) => {
  if (!req.user) {
    res.redirect("/");
  }
  res.render("member", { title: "Membership" });
};

const updateMessageGet = (req, res) => {
  if (!req.user.admin) {
    return res.redirect("/");
  }
  res.render("update", { title: "Update Message", id: req.params.id });
};

module.exports = {
  homePage,
  signUpGet,
  loginGet,
  loginFail,
  newMessageGet,
  membershipGet,
  updateMessageGet,
};
