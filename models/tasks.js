const mongoose = require("mongoose");

const repetitionSchema = mongoose.Schema({
  number: { type: Number, default: 1 },
  label: { type: String, default: "jour(s)" }, 
});

const insideToDosSchema = mongoose.Schema({
  toDo: [String],
});

const taskSchema = mongoose.Schema({
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
  name: { type: String, required: true, trim: true }, 
  description: String,
  createdAt: { type: Date, default: new Date(), required: true },
  tags: [{ type: mongoose.Schema.Types.ObjectId, ref: "tags" }],
  onPauseSince: Date, // Starting date of the pause
  onPauseTime: Date, // Length of the pause ?
  endDate: Date, // Ending date planned for the pause
  pauseDesc: String, // Reason for the pause
  type: String,
  isFavorite: { type: Boolean, default: false },
  dificulty: { type: Number, min: 1, max: 5, default: 1 },
  repetition: repetitionSchema,
  urgent: { type: Boolean, default: false },
  insideToDos: insideToDosSchema,
});

const Task = mongoose.model("tasks", taskSchema);

module.exports = Task;
