const express = require("express");
const route = express.Router();
const file = require("../models/file");
const assignment = require("../models/assignment");
const zipSchema = require("../models/zip");
const fs = require("fs");
const { authorize } = require("../functions/authFunctions");

route.use(authorize);
route.get("/:id", async (req, res) => {
    const currentAssignment = await assignment.findById(req.params.id).exec();
    if (!currentAssignment) return res.redirect("/");
    const allPDF = await file
        .find({ for: req.params.id })
        .populate("uploadBy")
        .exec();

    const userPDF = await file.findOne({
        uploadBy: req.user.id,
        for: req.params.id,
    });

    const zip = await zipSchema.findOne({ for: req.params.id }).exec();

    res.render("uploader.ejs", {
        page_title: "Assignment",
        user: req.user,
        assignment: currentAssignment,
        userPDF: userPDF,
        allPDF: allPDF,
        zip: zip,
    });
});

route.post("/", async (req, res) => {
    const { aId, uId } = req.query;
    const pdfData = JSON.parse(req.body.file);
    const pdfBuffer = new Buffer.from(pdfData.data, "base64");
    const newPDF = await file({
        name: req.body.name,
        location: "public/files",
        uploadBy: uId,
        for: aId,
    }).save();
    fs.writeFile(
        `${newPDF.location}/${newPDF.id}.${newPDF.type}`,
        pdfBuffer,
        (err) => {
            if (err) return console.log(err);
        }
    );
    res.redirect(`/upload/${aId}`);
});

module.exports = route;
