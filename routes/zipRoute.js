const express = require("express");
const route = express.Router();
const file = require("../models/file");
const AdmZip = require("adm-zip");
const zipSchema = require("../models/zip");
const fs = require("fs");
const { authorize } = require("../functions/authFunctions");

route.use(authorize);
route.use(require("../functions/no-cache"));
route.use(express.json());

route.get("/make/:id", async (req, res) => {
    const zip = new AdmZip();
    const allPDF = await file
        .find({ for: req.params.id })
        .populate("for")
        .exec();
    const assignmentName = allPDF[0].for.name;
    const newZip = zipSchema({
        name: assignmentName,
        location: "zips",
        for: req.params.id,
    });
    allPDF.forEach((PDF) => {
        zip.addLocalFile(`public/files/${PDF.id}.pdf`);
    });
    zip.writeZip(`${newZip.location}/${newZip._id}.${newZip.type}`);
    newZip.save();

    res.json({
        downloadUrl: `/zip/download/${newZip.id}`,
        deleteUrl: `/zip/delete/${newZip.id}`,
    });
});

route.get("/download/:id", async (req, res) => {
    const zip = await zipSchema.findById(req.params.id).exec();
    res.download(
        `${zip.location}/${zip._id}.${zip.type}`,
        `${zip.name}.${zip.type}`
    );
});

route.get("/delete/:id", async (req, res) => {
    const oldZip = await zipSchema.findByIdAndDelete(req.params.id).exec();
    fs.unlink(`${oldZip.location}/${oldZip._id}.${oldZip.type}`, (err) => {
        if (err) {
            console.error(err);
            return;
        }
    });
    res.redirect("/upload/" + oldZip.for);
});

module.exports = route;
