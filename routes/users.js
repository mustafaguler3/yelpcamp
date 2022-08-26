const express = require("express")
const router = express.Router()
const User = require("../models/user")
const catchAsync = require("../utils/catchAsync")
const passport = require("passport")
const users = require("../controllers/users")

router.get("/login",users.renderLogin)

router.post("/login",passport.authenticate("local",{failureFlash:true,failureRedirect:"/login"}),users.login)

router.get("/register",users.renderRegister)

router.post("/register",catchAsync(users.register))

router.get("/logout",users.logout)

module.exports = router;