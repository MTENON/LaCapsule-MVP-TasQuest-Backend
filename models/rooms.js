const mongoose = require("mongoose");

const messageSchema = mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    content: String,
    date: { type: Date, default: new Date() }
});

const roomSchema = mongoose.Schema({
    messages: [messageSchema],
    creator: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    quest: { type: mongoose.Schema.Types.ObjectId, ref: "quests" }
});

const Room = mongoose.model("rooms", roomSchema);

module.exports = Room;
