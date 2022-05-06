const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const users = require("../controlers/users");
const passport = require("passport");

//Show form for registration
router.get("/register", users.renderRegisterForm);

// Submit registration form
router.post("/register", catchAsync(users.createUser));

//Show form for login
router.get("/login", users.renderLoginForm);

//Submit login form
router.post("/login", passport.authenticate("local", {failureFlash: true, failureRedirect: "/login"}), users.login);

//Logout
router.get("/logout", users.logout)

module.exports = router;