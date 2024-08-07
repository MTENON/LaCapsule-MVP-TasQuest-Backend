const mongoose = require("mongoose");

const caracSchema = mongoose.Schema({
  name: String,
  description: String,
});

const Carac = mongoose.model("caracs", caracSchema);

module.exports = Carac;
