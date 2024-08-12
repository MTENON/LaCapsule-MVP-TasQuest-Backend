const Task = require("../../models/tasks");

async function pauseHabits(obj, res) {
  const { taskId, _id, PauseEndDate, pauseDesc } = obj;

  const filter = {
    creator: _id,
    type: "Habits",
    _id: taskId,
  };

  const now = moment.utc().toDate();

  const newData = {
    updatedAt: now,
    onPauseSince: now,
    PauseEndDate,
    pauseDesc,
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
  } else if (data.onPauseSince) {
    res.json({
      result: false,
      message: "Cette habitude est déjà en pause.",
    });
    return;
  }

  await Task.findByIdAndUpdate(habit._id.toString(), newData);

  res.json({ result: true, message: "Habitude mise en pause." });
}

module.exports = { pauseHabits };
