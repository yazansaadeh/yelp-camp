const express = require("express");
const router = express.Router({ mergeParams: true });
const catchAsync = require("../utils/catchAsync");
const { validateReview, islogin, isReviewAuthor } = require("../middleware");
const reviews = require("../controllers/reviews");

router.post("/", islogin, validateReview, catchAsync(reviews.createNewReview));

router.delete(
  "/:reviewId",
  islogin,
  isReviewAuthor,
  catchAsync(reviews.deleteReview)
);

module.exports = router;
