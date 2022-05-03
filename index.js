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
const campgroundRoutes = require("./routes/campgrounds");

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

const validateReview = (req, res, next) => {
  const {error} = reviewSchema.validate(req.body);
  if(error) {
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
app.use("/campgrounds", campgroundRoutes)

// REVIEWS
app.post("/campgrounds/:id/reviews", validateReview, catchAsync(async(req, res, next) =>{
  const campground = await Campground.findById(req.params.id);
  const review = new Review(req.body.review);
  campground.reviews.push(review);
  await review.save();
  await campground.save();
  res.redirect(`/campgrounds/${campground._id}`);
}));

app.delete("/campgrounds/:id/reviews/:reviewId", catchAsync(async(req, res, next) => {
  const {id, reviewId} = req.params;
  await Campground.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
  await Review.findByIdAndDelete(reviewId);
  res.redirect(`/campgrounds/${id}`);
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