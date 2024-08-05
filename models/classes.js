const mongoose = require("mongoose");

const classSchema = mongoose.Schema({
  name: { type: String, unique: true },
  image: String,
  icon: String,
  skills: [{ type: mongoose.Schema.Types.ObjectId, ref: "skills" }],
});

const Class = mongoose.model("classes", classSchema);

module.exports = Class;
