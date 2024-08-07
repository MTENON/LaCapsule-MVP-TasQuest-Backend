const mongoose = require("mongoose");

const logSchema = mongoose.Schema({
  date: Date, // { type: Date, default: Date.now },
  description: String,
});

const questSchema = mongoose.Schema({
  name: String, // { type: String, required: true, trim: true },
  description: String, // { type: String, minLength: 1, maxLength: 250 },
  monster: { type: mongoose.Schema.Types.ObjectId, ref: "monsters" },
  money: Number,
  XP: Number,
  difficulty: { type: Number, min: 1, max: 5 },
  loots: [{ type: mongoose.Schema.Types.ObjectId, ref: "items" }],
  log: [logSchema],
});

const Quest = mongoose.model("quests", questSchema);

module.exports = Quest;
