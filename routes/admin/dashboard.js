const express = require("express");
const route = express.Router();
const user = require("../../models/user");
const ROLE = require("../../models/role");
const { permit, authorize } = require("../../functions/authFunctions");

route.use(authorize);
route.use(permit(ROLE.ADMIN));

route.get("/", async (req, res) => {
  const users = await user.find().exec();
  res.render("admin/dashboard.ejs", { users: users, user: req.user });
});

module.exports = route;
