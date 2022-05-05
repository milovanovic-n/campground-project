const express = require("express");
const router = express.Router();
const User = require("../models/user");

//Show form for registration
router.get("/register", (req, res) => {
  res.render("users/register", {titleName: "Register"});
});
// Submit registration form
router.post("/register", async(req, res) => {
  const {username, email, password} = req.body;
  res.send(req.body)

})

module.exports = router;