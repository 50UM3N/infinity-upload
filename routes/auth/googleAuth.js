const express = require("express");
const route = express.Router();
const passport = require("passport");

route.use(require("../../functions/no-cache"));
// main authenticate route
route.get(
    "/",
    passport.authenticate("google", {
        scope: ["profile", "email"],
    })
);

// google callback route
route.get(
    "/callback",
    passport.authenticate("google", {
        successRedirect: "/",
        failureRedirect: "/login",
        failureFlash: true,
    })
);

module.exports = route;
