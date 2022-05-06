const express = require("express");
const router = express.Router();
const campgrounds = require("../controlers/campgrounds");
const catchAsync = require("../utils/catchAsync");

const {
  isLoggedIn, 
  isAuthor, 
  validateCampground
} = require("../middleware"); 

//-show all campgrounds
router.get("/", catchAsync(campgrounds.index));

//-show form to add a new campground
router.get("/new", isLoggedIn, campgrounds.renderNewForm);

//-create a new campground
router.post("/", isLoggedIn, validateCampground, catchAsync(campgrounds.createCampground));

//-show one campground
router.get("/:id", catchAsync(campgrounds.showCampground));

//-show form to edit a campground
router.get("/:id/edit", isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm));

//-edit the campground
router.put("/:id", isLoggedIn, isAuthor, validateCampground, catchAsync(campgrounds.updateCampground));

//-delete campground
router.delete("/:id", isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));

module.exports = router;