const User = require("../models/user");

module.exports.renderRegisterForm = (req, res) => {
  res.render("users/register", {titleName: "Register"});
}

module.exports.createUser = async(req, res, next) => {
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
}

module.exports.renderLoginForm = (req, res) => {
  res.render("users/login", {titleName: "Login"});
}

module.exports.login = (req, res) => {
  req.flash("success", "Welcome Back!");
  const returnTo = req.session.returnTo || "/campgrounds";
  delete req.session.returnTo;
  res.redirect(returnTo);
}

module.exports.logout = (req, res) => {
  req.logout();
  req.flash("success", "Goodbye!");
  res.redirect("/campgrounds");
}