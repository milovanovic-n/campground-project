const Campground = require("../models/campground");

module.exports.index =  async (req, res, next) => {
  const campgrounds = await Campground.find({});
  res.render("campgrounds/index", {campgrounds, titleName: "Campgrounds"});
}

module.exports.renderNewForm = (req, res) => {
  res.render("campgrounds/new", {titleName: "Add Campground"});
}

module.exports.createCampground =  async(req, res, next) => {
  //if(!req.body.campground) throw new ExpressError("Invalid Campground Data", 400);
  const camp = new Campground(req.body.campground);
  camp.images = req.files.map(f => ({url: f.path, filename: f.filename}));
  camp.author = req.user._id;
  await camp.save();
  req.flash("success", "Successfully made a new Campground");
  res.redirect(`/campgrounds/${camp._id}`);
}

module.exports.showCampground = async (req, res, next) => {
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
}

module.exports.renderEditForm =  async(req, res, next) => {
  const {id} = req.params;
  const camp = await Campground.findById(id);
  // if no Campground flash error message and redirect
  if(!camp) {
    req.flash("error", "Campground not found!");
    return res.redirect("/campgrounds");
  }
  res.render("campgrounds/edit", {camp, titleName: `Edit ${camp.title}`});
}

module.exports.updateCampground =  async(req, res, next) => {
  const {id} = req.params;
  const camp = await Campground.findByIdAndUpdate(id, {...req.body.campground});
  const images = req.files.map(f => ({url: f.path, filename: f.filename}))
  camp.images.push(...images);
  await camp.save();
  req.flash("success", "Successfully updated Campground!");
  res.redirect(`/campgrounds/${camp._id}`);
}

module.exports.deleteCampground =  async(req, res, next) => {
  const {id} = req.params;
  await Campground.findByIdAndDelete(id);
  req.flash("success", "Successfully deleted campground!");
  res.redirect("/campgrounds");
}