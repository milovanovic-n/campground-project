const express = require("express");
const router = express.Router();
const User = require("../models/user");
const catchAsync = require("../utils/catchAsync");

//Show form for registration
router.get("/register", (req, res) => {
  res.render("users/register", {titleName: "Register"});
});
// Submit registration form
router.post("/register", catchAsync(async(req, res) => {
  try {
    const {username, email, password} = req.body;
    const user = new User({username, email});
    const registredUser = await User.register(user, password);
    req.flash("success", "Welcome to Deer Camp");
    res.redirect("/campgrounds");
  } catch(e) {
    req.flash("error", e.message);
    res.redirect("/register");
  }
  
}));

module.exports = router;