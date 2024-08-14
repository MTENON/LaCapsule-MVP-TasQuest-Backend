// router.post("/unpause", (req, res) => {}
// checkBody(req.body, ["taskId"])

var moment = require("moment");
const Task = require("../../models/tasks");

async function unpauseHabits(obj, res) {
  const { taskId, _id } = obj;

  const filter = {
    creator: _id,
    type: "Habits",
    _id: taskId,
  };

  const now = moment.utc().toDate();

  const habit = await Task.findOne(filter)
    .select(
      "updatedAt startDate repetition.number repetition.label onPauseSince PauseEndDate pauseDesc"
    )
    .lean();

  const number = habit.repetition.number;
  const label = habit.repetition.label;

  const newData = {
    updatedAt: now,
    startDate: now,
    endDate: moment(now).utc().add(number, label),
    onPauseSince: null,
    PauseEndDate: null,
    pauseDesc: null,
  };

  if (!habit) {
    res.json({
      result: false,
      message: "Cette habitude n'existe pas.",
    });
    return;
  } else if (habit.onPauseSince === null) {
    res.json({
      result: false,
      message: "Cette habitude n'est pas en pause",
    });
    return;
  }

  await Task.findByIdAndUpdate(habit._id.toString(), newData);

  res.json({ result: true, message: "Habitude mise en pause" });
}

module.exports = { unpauseHabits };
