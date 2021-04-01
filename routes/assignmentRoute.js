const express = require("express");
const route = express.Router();
const assignment = require("../models/assignment");
const zipSchema = require("../models/zip");
const file = require("../models/file");
const fs = require("fs");
const ROLE = require("../models/role");

const { permit } = require("../functions/authFunctions");

route.use(permit([ROLE.ADMIN, ROLE.CO_ADMIN]));

route.get("/", (req, res) => {
  res.render("createAssignment.ejs", { user: req.user });
});

route.post("/:id", async (req, res) => {
  const { name, description, information } = req.body;
  await assignment({
    name: name,
    description: description,
    information: information,
    creator: req.params.id,
  }).save();
  res.redirect("/assignment");
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
