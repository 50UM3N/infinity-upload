const express = require("express");
const route = express.Router();
const passport = require("passport");
const { notAuthorize } = require("../../functions/authFunctions");

route.get("/", notAuthorize, (req, res) => {
  res.render("auth/login.ejs");
});

route.post(
  "/",
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
    successRedirect: "/",
  })
);

module.exports = route;
