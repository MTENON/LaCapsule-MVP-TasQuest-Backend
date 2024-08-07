const mongoose = require("mongoose");

const skillSchema = mongoose.Schema({
  name: { type: String, unique: true },
  icon: String,
  description: String,
  // type: String,
});

const Skill = mongoose.model("skills", skillSchema);

module.exports = Skill;
