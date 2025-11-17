const db = require('../db/queries')
const { body, validationResult, matchedData } = require('express-validator')
const bcrypt = require('bcryptjs')
const passport = require('passport')

const validateUser = [
    body("username").trim().isLength({ min: 1, max: 20 }).withMessage(`Username must be between 1 and 20 characters long`).matches(/^[a-zA-Z0-9 ]*$/).withMessage(`Username must only have characters numbers and spaces`),
    body("password").trim().isLength({ min: 6, max: 32 }).withMessage(`Password must be between 6 and 32 characters long`).matches(/^(?=.*[a-z0-9])[a-z0-9!@#$%&*.]+$/i).withMessage(`Password must only have characters, numbers, and special characters`),
    body("confirm_password").custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error("Password and Confirm Password fields aren't matching!")
        } else {
            return true;
        }
    })
]

const signUpGet = (req, res) => {
    if (req.user) {
        return res.redirect("/");
    }
    res.render("signup", { title: "Sign Up" })
}

const signUpPost = [validateUser, async (req, res) => {
    if (req.user) return res.redirect("/")
    const err = validationResult(req);
    if (!err.isEmpty()) {
        return res.render("signup", { title: "Sign Up", errors: err.errors })
    }
    const { username, password } = matchedData(req)
    const userAlreadyExists = await db.checkUser(username);
    if (userAlreadyExists) {
        return res.render("signup", {
            title: "Sign Up",
            errors: [{ msg: "Username is taken" }]
        })
    }
    try {
        const salt = await bcrypt.genSalt()
        const hashedPassword = await bcrypt.hash(password, salt)
        await db.insertUser(username, hashedPassword, salt)
    } catch (err) {
        console.error(err)
    } finally {
        res.redirect("/login")
    }
}]

const loginGet = (req, res) => {
    if (req.user) {
        return res.redirect("/");
    }
    res.render("login", { title: "Login" });
};
const loginPost = passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login-fail",
});

const loginFail = (req, res) => {
    if (req.user) {
        return res.redirect("/");
    }
    res.render("login-fail", { title: "Login" });
}

const logout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err)
        }
        res.redirect("/")
    })
}

const homePage = (req, res) => {
    res.render("index", { title: "Members Only" })
}

module.exports = {
    signUpGet,
    signUpPost,
    loginGet,
    loginPost,
    loginFail,
    logout,
    homePage
}
