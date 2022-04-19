const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const engine = require("ejs-mate");
const catchAsync = require("./utils/catchAsync");
const methodOverride = require("method-override");
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




/* HOME PAGE */
app.get("/", (req, res) => {
  res.render("home.ejs", {titleName: "Home"});
})

/* Campgrounds */
//-all
app.get("/campgrounds", catchAsync( async (req, res, next) => {
  const campgrounds = await Campground.find({});
  res.render("campgrounds/index", {campgrounds, titleName: "Campgrounds"})
}));
//-show form to add new
app.get("/campgrounds/new", (req, res) => {
  res.render("campgrounds/new", {titleName: "Add Campground"});
})
//-add new
app.post("/campgrounds", catchAsync( async(req, res, next) => {
  try { 
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
  } catch(e) {
    next(e)
  }
}));
//-one
app.get("/campgrounds/:id", catchAsync(async (req, res, next) => {
  const {id} = req.params
  const camp = await Campground.findById(id);
  res.render("campgrounds/show", {camp, titleName: camp.title})
}))
//-show form to edit a campground
app.get("/campgrounds/:id/edit", catchAsync( async(req, res, next) => {
  const {id} = req.params
  const camp = await Campground.findById(id);
  res.render("campgrounds/edit", {camp, titleName: `Edit ${camp.title}`})
}));
//-edit the campground
app.put("/campgrounds/:id", catchAsync( async(req, res, next) => {
  const {id} = req.params;
  const camp = await Campground.findByIdAndUpdate(id, {...req.body.campground});
  res.redirect(`/campgrounds/${id}`);
}));
//-delete campground
app.delete("/campgrounds/:id", catchAsync( async(req, res, next) => {
  const {id} = req.params;
  await Campground.findByIdAndDelete(id);
  res.redirect("/campgrounds");
}));

app.use((err, req, res, next) => {
  res.send("something went wrong")
})


/* START SERVER */
app.listen(3000, () => {
  console.log("SERVER IS RUNNING");
})