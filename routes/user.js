const express = require("express");
const catchAsync = require("../utils/catchAsync");
const passport = require("passport");
const users = require("../controllers/user");

const router = express.Router();

router
  .route("/register")
  .get(users.renderRegisterForm)
  .post(catchAsync(users.register));

router
  .route("/login")
  .get(users.renderLoginForm)
  .post(
    passport.authenticate("local", {
      failureFlash: true,
      failureRedirect: "/login",
    }),
    users.login
  );

router.get("/logout", users.logout);

module.exports = router;
