const user = require("../models/user");

module.exports.renderRegisterForm = (req, res) => {
  res.render("user/register");
};
module.exports.register = async (req, res, next) => {
  try {
    const { username, password, email } = req.body;
    const newUser = new user({ email, username });
    const registeredUser = await user.register(newUser, password);
    req.login(registeredUser, (e) => {
      if (e) return next(e);
      req.flash("success", "Welcome to Yelp Camp!");
      res.redirect("/campground");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/register");
  }
};
module.exports.renderLoginForm = (req, res) => {
  res.render("user/login");
};
module.exports.login = (req, res) => {
  const redirectTo = req.session.returnTo || "/campground";
  req.flash("success", "Welcome back");
  res.redirect(redirectTo);
};
module.exports.logout = (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.flash("success", "Goodbay");
    res.redirect("/campground");
  });
};
