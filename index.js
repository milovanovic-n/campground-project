const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const mongoose = require("mongoose");

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

/* CONFIG */
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
/* SERVE STATIC FILES */
app.use(express.static(path.join(__dirname,"public")));
/* PARSING req DATA */
app.use(express.urlencoded({extended: true}));
app.use(express.json());
/* Use Method--Override */
app.use(methodOverride("_method"));

/* HOME PAGE */
app.get("/", (req, res) => {
  res.render("home.ejs", {titleName: "Home"});
})

/* START SERVER */
app.listen(3000, () => {
  console.log("SERVER IS RUNNING");
})