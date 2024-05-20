if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const session = require("express-session");
const cookieSession = require("cookie-session");
const flash = require("connect-flash");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const expressError = require("./utils/expressError");
const campgroundRoutes = require("./routes/campgrounds");
const reviewRoutes = require("./routes/reviews");
const userRoutes = require("./routes/user");
const passport = require("passport");
const localStrategy = require("passport-local");
const user = require("./models/user");

const app = express();

mongoose.set("strictQuery", true);
mongoose
  .connect("mongodb://127.0.0.1:27017/yelp-camp")
  .then(() => {
    console.log("connect sucessfuly");
  })
  .catch((err) => {
    console.log("connect failed");
  });

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
const sessionConfig = {
  secret: "jhgljhfskdjf",
  resave: "false",
  saveUninitialized: "true",
  cookie: {
    httpOnly: true,
    expires: Date.now() * 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};

app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());
app.use((req, res, next) => {
  res.locals.currentUser = req.user;

  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

app.use("/campground", campgroundRoutes);
app.use("/campground/:id/review", reviewRoutes);
app.use("/", userRoutes);

app.get("/", (req, res) => {
  res.render("home");
});

app.all("*", (req, res, next) => {
  next(new expressError("page not found", 404));
});
app.use((err, req, res, next) => {
  const { statusCode = 500, message = "somthing went wrong" } = err;
  if (!err.message) err.message = "Oh Boy Somthing Went Wrong!";
  res.status(statusCode).render("error", { err });
});
app.listen(3000, () => {
  console.log("port 3000");
});
