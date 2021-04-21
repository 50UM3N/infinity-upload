const express = require("express");
const route = express.Router();
const { authorize } = require("../functions/authFunctions");
const assignment = require("../models/assignment");

route.get("/", authorize, async (req, res) => {
    const assignments = await assignment.find({}).populate("creator").exec();
    res.render("index.ejs", {
        page_title: "Infinity Upload",
        user: req.user,
        assignments: assignments,
    });
});

module.exports = route;
