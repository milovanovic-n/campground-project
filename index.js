const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");

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