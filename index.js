const express = require("express");
const app = express();
const path = require("path");
const engine = require("ejs-mate");
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const Campground = require("./models/campground");

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




/* HOME PAGE */
app.get("/", (req, res) => {
  res.render("home.ejs", {titleName: "Home"});
})

/* Campgrounds */
//-all
app.get("/campgrounds", async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render("campgrounds/index", {campgrounds, titleName: "Campgrounds"})
})
//-show form to add new
app.get("/campgrounds/new", (req, res) => {
  res.render("campgrounds/new", {titleName: "Add Campground"});
})
//-add new
app.post("/campgrounds", async(req, res) => {
  const {campground: {title, location, price, description, image}} = req.body
  const camp = new Campground({
    title,
    location,
    image,
    price,
    description
  })
  await camp.save()
  res.redirect(`/campgrounds/${camp._id}`);
})
//-one
app.get("/campgrounds/:id", async (req, res) => {
  const {id} = req.params
  const camp = await Campground.findById(id);
  res.render("campgrounds/show", {camp, titleName: camp.title})
})
//-show form to edit a campground
app.get("/campgrounds/:id/edit", async(req, res) => {
  const {id} = req.params
  const camp = await Campground.findById(id);
  res.render("campgrounds/edit", {camp, titleName: `Edit ${camp.title}`})
})
//-edit the campground
app.put("/campgrounds/:id", async(req, res) => {
  const {id} = req.params;
  const camp = await Campground.findByIdAndUpdate(id, {...req.body.campground});
  res.redirect(`/campgrounds/${id}`);
})
//-delete campground
app.delete("/campgrounds/:id", async(req, res) => {
  const {id} = req.params;
  await Campground.findByIdAndDelete(id);
  res.redirect("/campgrounds");
})


/* START SERVER */
app.listen(3000, () => {
  console.log("SERVER IS RUNNING");
})