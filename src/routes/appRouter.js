const { Router } = require("express");
const authController = require("../controllers/authController");
const pageController = require("../controllers/pageController");
const appRouter = Router();

appRouter.get("/", pageController.homePage);
appRouter.get("/signup", pageController.signUpGet);
appRouter.post("/signup", authController.signUpPost);
appRouter.get("/login", pageController.loginGet);
appRouter.post("/login", authController.loginPost);
appRouter.get("/login-fail", pageController.loginFail);
appRouter.get("/logout", authController.logout);
appRouter.get("/message/new", pageController.newMessageGet);
appRouter.post("/message/new", authController.newMessagePost);
appRouter.get("/membership", pageController.membershipGet);
appRouter.post("/membership", authController.membershipPost);

module.exports = appRouter;
