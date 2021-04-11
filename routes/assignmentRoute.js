const express = require("express");
const route = express.Router();
const assignment = require("../models/assignment");
const zipSchema = require("../models/zip");
const file = require("../models/file");
const fs = require("fs");
const ROLE = require("../models/role");
const { permit, authorize } = require("../functions/authFunctions");

route.use(authorize);
route.use(permit([ROLE.ADMIN, ROLE.CO_ADMIN]));

route.get("/", (req, res) => {
  res.render("assignment.ejs", { user: req.user });
});

route.post("/:id", async (req, res) => {
  const { name, description, information } = req.body;
  await assignment({
    name: name,
    description: description,
    information: information,
    creator: req.params.id,
  }).save();
  res.redirect("/");
});

route.get("/edit/:id", async (req, res) => {
  const currentAssignment = await assignment.findById(req.params.id).exec();
  if (!currentAssignment) return res.redirect("/");
  res.render("assignment.ejs", {
    user: req.user,
    assignment: currentAssignment,
  });
});

route.post("/update/:id", async (req, res) => {
  const { name, description, information } = req.body;
  await assignment.findByIdAndUpdate(req.params.id, {
    name: name,
    description: description,
    information: information,
  });
  res.redirect(`/upload/${req.params.id}`);
});

route.get("/delete/:id", async (req, res) => {
  const allPDF = await file.find({ for: req.params.id }).exec();
  allPDF.forEach(async (PDF) => {
    fs.unlink(`public/files/${PDF.id}.pdf`, (err) => {
      if (err) {
        console.error(err);
      }
    });
    await file.findByIdAndDelete(PDF.id).exec();
  });
  const zip = await zipSchema.findOne({ for: req.params.id }).exec();
  if (zip) {
    await zipSchema.findByIdAndDelete(zip.id).exec();
    fs.unlink(`zips/${zip.id}.zip`, (err) => {
      if (err) {
        console.error(err);
      }
    });
  }

  await assignment.findByIdAndDelete(req.params.id).exec();

  res.redirect("/");
});
module.exports = route;
