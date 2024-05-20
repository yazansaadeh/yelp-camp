const campground = require("../models/campground");
const { cloudinary } = require("../cloudinary/index");

module.exports.index = async (req, res) => {
  const camp = await campground.find({});
  res.render("campgrounds/index", { camp });
};
module.exports.renderNewCampground = (req, res) => {
  res.render("campgrounds/new");
};
module.exports.renderEditCampground = async (req, res) => {
  const { id } = req.params;
  const camp = await campground.findById(id);
  if (!camp) {
    req.flash("error", "Cannot find that campground");
    return res.redirect("/campground");
  }
  res.render("campgrounds/edit", { camp });
};
module.exports.showCampground = async (req, res) => {
  const { id } = req.params;
  const camp = await campground
    .findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("author");
  if (!camp) {
    req.flash("error", "Cannot find that campground");
    return res.redirect("/campground");
  }
  res.render("campgrounds/show", { camp });
};
module.exports.editCampground = async (req, res) => {
  const { id } = req.params;
  const editedCamp = await campground.findByIdAndUpdate(id, {
    ...req.body.campground,
  });
  const imgs = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));
  editedCamp.images.push(...imgs);
  await editedCamp.save();
  if (req.body.deleteImg) {
    for (let filename of req.body.deleteImg) {
      await cloudinary.uploader.destroy(filename);
    }
    await editedCamp.updateOne({
      $pull: { images: { filename: { $in: req.body.deleteImg } } },
    });
  }
  req.flash("success", "Successful updeted campgrond!");
  res.redirect(`/campground/${editedCamp._id}`);
};
module.exports.createCampground = async (req, res) => {
  const camp = req.body.campground;
  camp.images = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));

  const newCampground = new campground({
    title: camp.title,
    location: camp.location,
    description: camp.description,
    images: camp.images,
    price: camp.price,
  });
  newCampground.author = req.user._id;
  await newCampground.save();
  req.flash("success", "Successful made a new campgrond!");
  res.redirect(`/campground/${newCampground._id}`);
  console.log(newCampground);
};
module.exports.deleteCampground = async (req, res) => {
  const { id } = req.params;
  await campground.findByIdAndDelete(id);
  req.flash("success", "Successful deleted campgrond!");
  res.redirect("/campground");
};
