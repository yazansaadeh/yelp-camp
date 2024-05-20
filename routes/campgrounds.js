const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const { islogin, validateCampground, isAuthor } = require("../middleware");
const campgronds = require("../controllers/campgrounds");
const multer = require("multer");
const { storage } = require("../cloudinary/index");
const upload = multer({ storage });

router
  .route("/")
  .get(catchAsync(campgronds.index))
  .post(
    islogin,
    upload.array("image"),
    validateCampground,
    catchAsync(campgronds.createCampground)
  );

router.get("/new", islogin, campgronds.renderNewCampground);

router
  .route("/:id")
  .get(catchAsync(campgronds.showCampground))
  .put(
    islogin,
    upload.array("image"),
    isAuthor,
    validateCampground,
    catchAsync(campgronds.editCampground)
  )
  .delete(islogin, isAuthor, catchAsync(campgronds.deleteCampground));

router.get(
  "/:id/edit",
  islogin,
  isAuthor,
  catchAsync(campgronds.renderEditCampground)
);

module.exports = router;
