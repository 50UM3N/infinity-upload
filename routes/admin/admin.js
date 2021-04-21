const express = require("express");
const route = express.Router();
const user = require("../../models/user");
const ROLE = require("../../models/role");
const { permit, authorize } = require("../../functions/authFunctions");

route.use(authorize);
route.use(permit(ROLE.ADMIN));

route.get("/delete/:id", async (req, res) => {
    await user.findByIdAndDelete(req.params.id).exec();
    res.redirect("/dashboard");
});
route.get("/update", async (req, res) => {
    const { role, id } = req.query;
    await user.findByIdAndUpdate(id, { role: role }).exec();
    res.redirect("/dashboard");
});

module.exports = route;
