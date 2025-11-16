const { Router } = require('express')
const controller = require('../controllers/controller')
const appRouter = Router()

appRouter.get("/", (req, res) => res.send("<a href='/signup'>Sign Up</a>"))
appRouter.get("/signup", controller.signUpGet)

module.exports = appRouter
