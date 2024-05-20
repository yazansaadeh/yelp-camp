const review = require("../models/review");
const campground = require("../models/campground");

module.exports.createNewReview = async (req, res) => {
  const { id } = req.params;
  const camp = await campground.findById(id);
  const newReview = new review(req.body.review);
  newReview.author = req.user._id;
  camp.reviews.push(newReview);
  await camp.save();
  await newReview.save();
  req.flash("success", "Successful made a new reviwe!");
  res.redirect(`/campground/${camp._id}`);
};
module.exports.deleteReview = async (req, res) => {
  const { id, reviewId } = req.params;
  await campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await review.findByIdAndDelete(reviewId);
  req.flash("success", "Successful deleted reviwe");
  res.redirect(`/campground/${id}`);
};
