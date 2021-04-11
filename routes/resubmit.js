const express = require("express");
const route = express.Router();
const file = require("../models/file");
const fs = require("fs");
const { authorize } = require("../functions/authFunctions");

route.use(authorize);
route.get("/:id", async (req, res) => {
  await file.findByIdAndDelete(req.params.id).exec();
  fs.unlink(`public/files/${req.params.id}.pdf`, (err) => {
    if (err) {
      console.error(err);
      return;
    }
  });
  res.redirect(`/upload/${req.query.aId}`);
});

module.exports = route;
