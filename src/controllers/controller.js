const signUpGet = (req, res) => {
    if (req.user) {
        return res.redirect("/");
    }
    res.render("signup", { title: "Sign Up" })
}

module.exports = {
    signUpGet
}
