const { campgroundSchema, reviweSchema } = require("./schemas.js");
const expressError = require("./utils/expressError");
const campground = require("./models/campground");
const reviews = require("./models/review.js");

module.exports.islogin = (req, res, next) => {
  req.session.returnTo = req.originalUrl;
  if (!req.isAuthenticated()) {
    req.flash("error", "you must login first");
    return res.redirect("/login");
  }
  next();
};
module.exports.validateCampground = (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new expressError(msg, 404);
  } else {
    next();
  }
};
module.exports.validateReview = (req, res, next) => {
  const { error } = reviweSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new expressError(msg, 404);
  } else {
    next();
  }
};
module.exports.isAuthor = async (req, res, next) => {
  const { id } = req.params;
  const camp = await campground.findById(id);
  if (!camp.author.equals(req.user._id)) {
    req.flash("error", "You do not have permission to do that");
    return res.redirect(`/campground/${id}`);
  } else {
    next();
  }
};
module.exports.isReviewAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params;
  const review = await reviews.findById(reviewId);
  if (!review.author.equals(req.user._id)) {
    req.flash("error", "You do not have permission to do that");
    return res.redirect(`/campground/${id}`);
  } else {
    next();
  }
};
