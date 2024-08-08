const mongoose = require("mongoose");

const repetitionSchema = mongoose.Schema({
    number: Number,
    label: String,
});

const insideToDosSchema = mongoose.Schema({
    toDo: String,
    todoIsCompleted: Boolean,
});

const taskSchema = mongoose.Schema({
    creator: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    type: String,
    name: { type: String, required: true, trim: true },
    description: String,
    startDate: { type: Date, default: new Date(), required: true },
    endDate: { type: Date, default: null },
    createdAt: { type: Date, default: new Date(), required: true },
    updatedAt: { type: Date, default: null },
    tags: [{ type: mongoose.Schema.Types.ObjectId, ref: "tags" }],
    difficulty: { type: Number, min: 1, max: 5, default: 1 },
    repetition: repetitionSchema,
    isFavorite: { type: Boolean, default: false },
    onPauseSince: { type: Date, default: null }, // Starting date of the pause
    PauseEndDate: { type: Date, default: null }, // Ending date planned for the pause
    pauseDesc: { type: String, default: null }, // Reason for the pause
    insideToDos: [insideToDosSchema],
    isUrgent: { type: Boolean, default: false },
    isDone: { type: Boolean, default: false },
});

const Task = mongoose.model("tasks", taskSchema);

module.exports = Task;
