const mongoose = require("mongoose");

const itemSchema = mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  type: String,
  icon: String,
});

const Item = mongoose.model("items", itemSchema);

module.exports = Item;
