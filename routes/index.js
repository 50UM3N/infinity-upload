const express = require("express");
const route = express.Router();
const { introized } = require("../functions/authFunctions");
const assignment = require("../models/assignment");

route.get("/", introized, async (req, res) => {
  const assignments = await assignment.find({}).populate("creator").exec();
  res.render("index.ejs", { user: req.user, assignments: assignments });
});

route.get("/intro", (req, res) => {
  res.render("intro.ejs");
});

module.exports = route;
