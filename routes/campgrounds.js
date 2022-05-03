const express = require("express");
const router = express.Router();
const Campground = require("../models/campground");
const {campgroundSchema} = require("../schemas.js");
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");

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

//-all
router.get("/", catchAsync( async (req, res, next) => {
  const campgrounds = await Campground.find({});
  res.render("campgrounds/index", {campgrounds, titleName: "Campgrounds"})
}));
//-show form to add new
router.get("/new", (req, res) => {
  res.render("campgrounds/new", {titleName: "Add Campground"});
})
//-add new
router.post("/", validateCampground, catchAsync( async(req, res, next) => {
  //if(!req.body.campground) throw new ExpressError("Invalid Campground Data", 400);
  const camp = new Campground(req.body.campground)
  await camp.save()
  res.redirect(`/campgrounds/${camp._id}`);
}));
//-one
router.get("/:id", catchAsync(async (req, res, next) => {
  const {id} = req.params
  const camp = await Campground.findById(id).populate("reviews");
  res.render("campgrounds/show", {camp, titleName: camp.title})
}))
//-show form to edit a campground
router.get("/:id/edit", catchAsync( async(req, res, next) => {
  const {id} = req.params
  const camp = await Campground.findById(id);
  res.render("campgrounds/edit", {camp, titleName: `Edit ${camp.title}`})
}));
//-edit the campground
router.put("/:id", validateCampground, catchAsync( async(req, res, next) => {
  const {id} = req.params;
  const camp = await Campground.findByIdAndUpdate(id, {...req.body.campground});
  res.redirect(`/campgrounds/${id}`);
}));
//-delete campground
router.delete("/:id", catchAsync( async(req, res, next) => {
  const {id} = req.params;
  await Campground.findByIdAndDelete(id);
  res.redirect("/campgrounds");
}));

module.exports = router;