const mongoose = require("mongoose");

const skillSchema = mongoose.Schema({
  skill: { type: mongoose.Schema.Types.ObjectId, ref: "skills" },
  skillLevel: { type: Number, min: 1, default: 1 }, // { type: Number, default: 1 }
});

const caracSchema = mongoose.Schema({
  carac: { type: mongoose.Schema.Types.ObjectId, ref: "caracs" }, // , default: null
  level: { type: Number, min: 0, default: 0 }, // { type: Number, default: 1 }
});

const caracteristicSchema = mongoose.Schema({
  level: { type: Number, min: 1, default: 1 }, // { type: Number, default: 1 }
  HP: { type: Number, min: 0, default: 10 }, // , default: 200? 
  XP: { type: Number, min: 0, default: 0 }, // , default: 0?
  // combo: Number, ? // { type: Number, default: 0 }
  caracs: [caracSchema],
});

const equipmentSchema = mongoose.Schema({
  necklace: { type: mongoose.Schema.Types.ObjectId, ref: "items", default: null }, // , default: ""
  head: { type: mongoose.Schema.Types.ObjectId, ref: "items", default: null }, // , default: ""
  hand1: { type: mongoose.Schema.Types.ObjectId, ref: "items", default: null }, // , default: ""
  body: { type: mongoose.Schema.Types.ObjectId, ref: "items", default: null }, // , default: ""
  hand2: { type: mongoose.Schema.Types.ObjectId, ref: "items", default: null }, // , default: ""
  bracelet: { type: mongoose.Schema.Types.ObjectId, ref: "items", default: null }, // , default: ""
  feets: { type: mongoose.Schema.Types.ObjectId, ref: "items", default: null }, // , default: ""
  ring: { type: mongoose.Schema.Types.ObjectId, ref: "items", default: null }, // , default: ""
});

const characterSchema = mongoose.Schema({
  name: { type: String, unique: true, required: true }, // trim: true
  class: { type: mongoose.Schema.Types.ObjectId, ref: "classes" },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
  icon: String,
  skills: [skillSchema],
  caracteristics: caracteristicSchema,
  money: { type: Number, default: 5 }, // { type: Number, default: 10 }
  inventory: [{ type: mongoose.Schema.Types.ObjectId, ref: "items" }],
  equipment: equipmentSchema,
  quest: { type: mongoose.Schema.Types.ObjectId, ref: "rooms" },
});

const Character = mongoose.model("characters", characterSchema);

module.exports = Character;
