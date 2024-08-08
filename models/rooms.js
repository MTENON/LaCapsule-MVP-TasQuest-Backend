const mongoose = require("mongoose");

const messageSchema = mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    content: String,
    data: Date
})

const roomSchema = mongoose.Schema({
    messages: [messageSchema],
});

const Message = mongoose.model("messages", messageSchema);

module.exports = Room;
