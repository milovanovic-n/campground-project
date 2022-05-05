const express = require("express");
const router = express.Router();
const User = require("../models/user");
const catchAsync = require("../utils/catchAsync");
const passport = require("passport");

//Show form for registration
router.get("/register", (req, res) => {
  res.render("users/register", {titleName: "Register"});
});
// Submit registration form
router.post("/register", catchAsync(async(req, res, next) => {
  try {
    const {username, email, password} = req.body;
    const user = new User({username, email});
    const registredUser = await User.register(user, password);
    req.login(registredUser, err => {
      if(err) return next(err)
      req.flash("success", "Welcome to Deer Camp");
      res.redirect("/campgrounds");
    })
  } catch(e) {
    req.flash("error", e.message);
    res.redirect("/register");
  }
  
}));

//Show form for login
router.get("/login", (req, res) => {
  res.render("users/login", {titleName: "Login"});
});
//Submit login form
router.post("/login", passport.authenticate("local", {failureFlash: true, failureRedirect: "/login"}), (req, res) => {
  req.flash("success", "Welcome Back!");
  res.redirect("/campgrounds");
})

//Logout
router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success", "Goodbye!");
  res.redirect("/campgrounds");
})

module.exports = router;