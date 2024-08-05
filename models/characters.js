const mongoose = require("mongoose");

const skillSchema = mongoose.Schema({
  skill: { type: mongoose.Schema.Types.ObjectId, ref: "skills" },
  skillLevel: Number, // { type: Number, default: 1 }
});

const caracSchema = mongoose.Schema({
  carac: { type: mongoose.Schema.Types.ObjectId, ref: "caracs" }, // , default: null
  level: Number, // { type: Number, default: 1 }
});

const caracteristicSchema = mongoose.Schema({
  level: Number, // { type: Number, default: 1 }
  HP: { type: Number, min: 0 }, // , default: 200? 
  XP: { type: Number, min: 0 }, // , default: 0?
  // combo: Number, ? // { type: Number, default: 0 }
  caracs: [caracSchema],
});

const equipmentSchema = mongoose.Schema({
  necklace: { type: mongoose.Schema.Types.ObjectId, ref: "items" }, // , default: ""
  head: { type: mongoose.Schema.Types.ObjectId, ref: "items" }, // , default: ""
  hand1: { type: mongoose.Schema.Types.ObjectId, ref: "items" }, // , default: ""
  body: { type: mongoose.Schema.Types.ObjectId, ref: "items" }, // , default: ""
  hand2: { type: mongoose.Schema.Types.ObjectId, ref: "items" }, // , default: ""
  bracelet: { type: mongoose.Schema.Types.ObjectId, ref: "items" }, // , default: ""
  feets: { type: mongoose.Schema.Types.ObjectId, ref: "items" }, // , default: ""
  ring: { type: mongoose.Schema.Types.ObjectId, ref: "items" }, // , default: ""
});

const characterSchema = mongoose.Schema({
  name: { type: String, unique: true, required: true }, // trim: true
  class: { type: mongoose.Schema.Types.ObjectId, ref: "classes" },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
  skills: [skillSchema],
  caracteristics: caracteristicSchema,
  money: Number, // { type: Number, default: 10 }
  inventory: [{ type: mongoose.Schema.Types.ObjectId, ref: "items" }],
  equipement: equipmentSchema,
  quest: { type: mongoose.Schema.Types.ObjectId, ref: "quests" },
});

const Character = mongoose.model("characters", characterSchema);

module.exports = Character;
