const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  username: { type: String, unique: true, required: true, }, // trim: true
  email: { type: String, unique: true, required: true }, // trim: true
  password: { type: String, required: true },
  token: { type: String, unique: true, required: true },
  createdAt: Date, // { type: Date, default: Date.now, required: true },
  updatedAt: Date, // { type: Date, default: null },
  lastConnectionAt: Date, // { type: Date, default: Date.now, required: true },
});

const User = mongoose.model("users", userSchema);

module.exports = User;
