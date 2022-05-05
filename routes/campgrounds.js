const express = require("express");
const router = express.Router();
const Campground = require("../models/campground");
const catchAsync = require("../utils/catchAsync");

const {
  isLoggedIn, 
  isAuthor, 
  validateCampground
} = require("../middleware"); 

//-all
router.get("/", catchAsync( async (req, res, next) => {
  const campgrounds = await Campground.find({});
  res.render("campgrounds/index", {campgrounds, titleName: "Campgrounds"});
}));
//-show form to add new
router.get("/new", isLoggedIn, (req, res) => {
  res.render("campgrounds/new", {titleName: "Add Campground"});
})
//-add new
router.post("/", isLoggedIn, validateCampground, catchAsync( async(req, res, next) => {
  //if(!req.body.campground) throw new ExpressError("Invalid Campground Data", 400);
  const camp = new Campground(req.body.campground);
  camp.author = req.user._id;
  await camp.save();
  req.flash("success", "Successfully made a new Campground");
  res.redirect(`/campgrounds/${camp._id}`);
}));
//-one
router.get("/:id", catchAsync(async (req, res, next) => {
  const {id} = req.params;
  const camp = await Campground.findById(id).populate({
    path: "reviews",
    populate: {
      path: "author"
    }
  }).populate("author");
  // if no Campground flash error message and redirect
  if(!camp) {
    req.flash("error", "Campground not found!");
    return res.redirect("/campgrounds");
  }
  res.render("campgrounds/show", {camp, titleName: camp.title});
}))
//-show form to edit a campground
router.get("/:id/edit", isLoggedIn, isAuthor, catchAsync( async(req, res, next) => {
  const {id} = req.params;
  const camp = await Campground.findById(id);
  // if no Campground flash error message and redirect
  if(!camp) {
    req.flash("error", "Campground not found!");
    return res.redirect("/campgrounds");
  }
  res.render("campgrounds/edit", {camp, titleName: `Edit ${camp.title}`});
}));
//-edit the campground
router.put("/:id", isLoggedIn, isAuthor, validateCampground, catchAsync( async(req, res, next) => {
  const {id} = req.params;
  const camp = await Campground.findByIdAndUpdate(id, {...req.body.campground});
  req.flash("success", "Successfully updated Campground!");
  res.redirect(`/campgrounds/${camp._id}`);
}));
//-delete campground
router.delete("/:id", isLoggedIn, isAuthor, catchAsync( async(req, res, next) => {
  const {id} = req.params;
  await Campground.findByIdAndDelete(id);
  req.flash("success", "Successfully deleted campground!");
  res.redirect("/campgrounds");
}));

module.exports = router;