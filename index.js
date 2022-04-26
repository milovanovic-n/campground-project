const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const engine = require("ejs-mate");
const {campgroundSchema, reviewSchema} = require("./schemas.js");
const catchAsync = require("./utils/catchAsync");
const ExpressError = require("./utils/ExpressError");
const methodOverride = require("method-override");
const Campground = require("./models/campground");
const Review = require("./models/review");

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

//VALIDATIONS --Joi--
const validateCampground = (req, res, next) => {
  const {error} = campgroundSchema.validate(req.body);
  if(error) {
    const msg = error.details.map(el => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

const validateReview = (req, res, next) => {
  const {error} = reviewSchema.validate(req.body);
  if(error) {
    console.log(error)
    const msg = error.details.map(el => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
}


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
app.post("/campgrounds", validateCampground, catchAsync( async(req, res, next) => {
  //if(!req.body.campground) throw new ExpressError("Invalid Campground Data", 400);
  const camp = new Campground(req.body.campground)
  await camp.save()
  res.redirect(`/campgrounds/${camp._id}`);
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
app.put("/campgrounds/:id", validateCampground, catchAsync( async(req, res, next) => {
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

// REVIEWS
app.post("/campgrounds/:id/reviews", validateReview, catchAsync(async(req, res, next) =>{
  const campground = await Campground.findById(req.params.id);
  const review = new Review(req.body);
  campground.reviews.push(review);
  await review.save();
  await campground.save();
  res.redirect(`/campgrounds/${campground._id}`);
}))

app.all("*", (req, res, next) => {
  next(new ExpressError("Page not found!", 404));
});

app.use((err, req, res, next) => {
  const {statusCode = 500} = err;
  if(!err.message) err.message = "Something went wrong!";
  res.status(statusCode).render("error", {err, titleName: "Error"});
})


/* START SERVER */
app.listen(3000, () => {
  console.log("SERVER IS RUNNING");
})