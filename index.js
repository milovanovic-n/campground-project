const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const engine = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");
const ExpressError = require("./utils/ExpressError");
const methodOverride = require("method-override");
const campgroundRoutes = require("./routes/campgrounds");
const reviewRoutes = require("./routes/reviews");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");

/* Connect Database */
mongoose.connect("mongodb://localhost:27017/campgroundProject", {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Connected to DB");
  })
  .catch(err => {
    console.log("Connection error");
    console.log(err);
  })

const app = express();

/* CONFIG */
app.engine("ejs", engine);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
/* SERVE STATIC FILES */
app.use(express.static(path.join(__dirname,"public")));
/* PARSING req DATA */
app.use(express.urlencoded({extended: true}));
app.use(express.json());
/* Use Method--Override */
app.use(methodOverride("_method"));

//SESSION
const sessionConfig = {
  secret: "replacethissecretinproduction",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    // expires a week from now
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7
  }
};
app.use(session(sessionConfig));
app.use(flash());
//PASSPORT
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
//FLASH
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
})


/* HOME PAGE */
app.get("/", (req, res) => {
  res.render("home.ejs", {titleName: "Home"});
});
app.get("/fake", async (req, res) => {
  const user = new User({email: "neno@gmail.com", username: "Neno"});
  const newUser = await User.register(user, "nenoneno");
  res.send(newUser)
})
/* CAMPGROUNDS */
app.use("/campgrounds", campgroundRoutes);
/* REVIEWS */
app.use("/campgrounds/:id/reviews", reviewRoutes);


app.all("*", (req, res, next) => {
  next(new ExpressError("Page not found!", 404));
});

app.use((err, req, res, next) => {
  const {statusCode = 500} = err;
  if(!err.message) err.message = "Something went wrong!";
  res.status(statusCode).render("error", {err, titleName: "Error"});
});


/* START SERVER */
app.listen(3000, () => {
  console.log("SERVER IS RUNNING");
});