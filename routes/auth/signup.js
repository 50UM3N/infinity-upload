const express = require("express");
const route = express.Router();
const user = require("../../models/user");
const { notAuthorize } = require("../../functions/authFunctions");

route.get("/", notAuthorize, (req, res) => {
  res.render("auth/signup.ejs");
});

route.post("/", async (req, res) => {
  const { name, email, password } = req.body;

  const userData = await user.findOne({ email: email }).exec();
  if (userData) {
    req.flash("errorMsg", "User Already exist");
    res.redirect("/signup");
  } else {
    await user({
      name: name,
      email: email,
      password: password,
      role: "user",
    }).save();
  }
  req.flash("successMsg", "Signup successful");
  res.redirect("/signup");
});

module.exports = route;
