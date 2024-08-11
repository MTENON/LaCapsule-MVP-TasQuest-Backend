var moment = require("moment");
const Task = require("../../models/tasks");

async function unpauseHabits(obj, res) {
  const { taskId, _id } = obj;

  const filter = {
    creator: _id,
    type: "Habits",
    _id: taskId,
  };

  const newData = {
    updatedAt: new Date(),
    onPauseSince: null,
    PauseEndDate: null,
    pauseDesc: null,
  };

  const habit = await Task.findOne(filter)
    .select("updatedAt onPauseSince PauseEndDate pauseDesc")
    .lean();

  if (!habit) {
    res.json({
      result: false,
      message: "Cette habitude n'existe pas.",
    });
    return;
  } else if (data.onPauseSince === null) {
    res.json({
      result: false,
      message: "Cette habitude n'est pas en pause",
    });
    return;
  }

  await Task.updateOne({ _id: data._id }, { newData });

  res.json({ result: true, message: "Habitude mise en pause" });
}

module.exports = { unpauseHabits };
