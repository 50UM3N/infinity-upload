const mongoose = require("mongoose");
const user = require("./user");
const Schema = mongoose.Schema;
const assignment = Schema({
  name: {
    type: String,
    require: true,
  },
  description: {
    type: String,
    require: true,
  },
  information: {
    type: String,
    require: true,
  },
  creator: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
});
assignment.virtual("createdAt").get(function () {
  var a = this.id;
  return new Date(parseInt(a.substring(0, 8), 16) * 1000);
});
module.exports = new mongoose.model("assignment", assignment);
