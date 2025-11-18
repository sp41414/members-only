const db = require("../db/queries");
const { body, validationResult, matchedData } = require("express-validator");
const bcrypt = require("bcryptjs");
const passport = require("passport");

const validateUser = [
  body("username")
    .trim()
    .isLength({ min: 1, max: 20 })
    .withMessage(`Username must be between 1 and 20 characters long`)
    .matches(/^[a-zA-Z0-9 ]*$/)
    .withMessage(`Username must only have characters numbers and spaces`),
  body("password")
    .trim()
    .isLength({ min: 6, max: 32 })
    .withMessage(`Password must be between 6 and 32 characters long`)
    .matches(/^(?=.*[a-z0-9])[a-z0-9!@#$%&*.]+$/i)
    .withMessage(
      `Password must only have characters, numbers, and special characters`
    ),
  body("confirm_password").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Password and Confirm Password fields aren't matching!");
    } else {
      return true;
    }
  }),
];

const validateMessage = [
  body("title")
    .trim()
    .isLength({ min: 1, max: 32 })
    .withMessage("Title must be between 1 and 32 characters long")
    .matches(/^(?=.*[a-z0-9 ])[a-z0-9!@#$%&*. ]{1,}$/i)
    .withMessage(
      "Title must only contain spaces, special characters, characters and numbers"
    )
    .escape(),
  body("text")
    .trim()
    .isLength({ min: 1, max: 300 })
    .withMessage("Text must be between 1 and 300 characters long")
    .matches(/^(?=.*[a-z0-9 ])[a-z0-9!@#$%&*. ]{1,}$/i)
    .withMessage(
      "Text must only contain spaces, special characters, characters, and numbers"
    )
    .escape(),
];

const validateMembership = [
  body("password").custom((value) => {
    if (value !== process.env.SECRET_PASS) {
      throw new Error("Incorrect password");
    } else {
      return true;
    }
  }),
];

const signUpPost = [
  validateUser,
  async (req, res) => {
    if (req.user) return res.redirect("/");
    const err = validationResult(req);
    if (!err.isEmpty()) {
      return res.render("signup", { title: "Sign Up", errors: err.errors });
    }
    const { username, password } = matchedData(req);
    const userAlreadyExists = await db.checkUser(username);
    if (userAlreadyExists) {
      return res.render("signup", {
        title: "Sign Up",
        errors: [{ msg: "Username is taken" }],
      });
    }
    try {
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(password, salt);
      await db.insertUser(username, hashedPassword, salt);
    } catch (err) {
      console.error(err);
    } finally {
      res.redirect("/login");
    }
  },
];

const loginPost = passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/login-fail",
});

const logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
};

const newMessagePost = [
  validateMessage,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render("message", {
        title: "New Message",
        errors: errors.errors,
      });
    }

    if (!req.user) {
      return res.redirect("/");
    }

    const { title, text } = matchedData(req);

    try {
      await db.createMessage(
        req.user.username,
        title,
        text,
        req.user.membership
      );
    } catch (err) {
      console.error(err);
    } finally {
      return res.redirect("/");
    }
  },
];

const membershipPost = [
  validateMembership,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render("member", {
        title: "Membership",
        errors: errors.errors,
      });
    }
    if (!req.user) {
      return res.redirect("/signup");
    }
    try {
      await db.updateMembership(req.user.id, true);
    } catch (err) {
      console.error(err);
    } finally {
      res.redirect("/");
    }
  },
];

const deleteMessage = async (req, res) => {
  if (!req.user.admin) {
    return res.redirect("/");
  }
  const id = req.params.id;
  try {
    await db.deleteMessage(id);
  } catch (err) {
    console.error(err);
  } finally {
    res.redirect("/");
  }
};

const updateMessage = [
  validateMessage,
  async (req, res) => {
    if (!req.user.admin) {
      return res.redirect("/");
    }
    const errors = validationResult(req);
    const id = req.params.id;
    if (!errors.isEmpty()) {
      return res.render("update", {
        title: "Update Message",
        errors: errors.errors,
        id: id,
      });
    }
    const { title, text } = matchedData(req);
    try {
      await db.updateMessage(id, title, text);
    } catch (err) {
      console.error(err);
    } finally {
      res.redirect("/");
    }
  },
];

module.exports = {
  signUpPost,
  loginPost,
  logout,
  newMessagePost,
  membershipPost,
  deleteMessage,
  updateMessage,
};
