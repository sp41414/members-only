const { Router } = require('express')
const controller = require('../controllers/controller')
const appRouter = Router()

appRouter.get("/", controller.homePage);
appRouter.get("/signup", controller.signUpGet)
appRouter.post("/signup", controller.signUpPost)
appRouter.get("/login", controller.loginGet)
appRouter.post("/login", controller.loginPost)
appRouter.get("/login-fail", controller.loginFail)
appRouter.get("/logout", controller.logout)

module.exports = appRouter
