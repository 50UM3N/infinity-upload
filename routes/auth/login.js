const express = require("express");
const route = express.Router();
const passport = require("passport");
const { notAuthorize } = require("../../functions/authFunctions");

route.use(require("../../functions/no-cache"));

route.get("/", notAuthorize, (req, res) => {
    res.render("auth/login.ejs", { page_title: "Login" });
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
