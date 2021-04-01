const mongoose = require("mongoose");
const assignment = require("./assignment");

const zip = mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  location: {
    type: String,
    require: true,
  },
  type: {
    type: String,
    default: "zip",
  },
  for: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "assignment",
  },
});

zip.virtual("createdAt").get(function () {
  var a = this.id;
  const d = new Date(parseInt(a.substring(0, 8), 16) * 1000);
  return d;
});
module.exports = new mongoose.model("zip", zip);
