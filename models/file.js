const mongoose = require("mongoose");

const file = mongoose.Schema({
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
        default: "pdf",
    },
    uploadBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
    },
    for: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "assignment",
    },
});

file.virtual("createdAt").get(function () {
    var a = this.id;
    return new Date(parseInt(a.substring(0, 8), 16) * 1000);
});

module.exports = new mongoose.model("file", file);
