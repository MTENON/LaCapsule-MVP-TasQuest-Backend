var moment = require("moment");
const Task = require("../../models/tasks");

async function modifyHabits(obj, res) {
  const {
    taskId,
    _id,
    name,
    description,
    tags,
    difficulty,
    number,
    label,
    isFavorite,
    startDate,
    PauseEndDate,
    pauseDesc,
  } = obj;

  const filter = {
    creator: _id,
    type: "Habits",
    _id: taskId,
  };

  const habit = await Task.findOne(filter)
    .select(
      "name description endDate updatedAt tags difficulty repetition.number repetition.label isFavorite PauseEndDate pauseDesc"
    )
    .lean();

    const now = moment.utc().toDate();

  const newData = {
    name,
    description,
    endDate: moment(startDate).utc().add(number, label),
    updatedAt: now,
    tags,
    difficulty,
    repetition: {
      number,
      label,
    },
    isFavorite,
    PauseEndDate,
    pauseDesc,
  };

  if (!habit) {
    res.json({
      result: false,
      message: "Cette habitude n'existe pas.",
    });
    return;
  }

  await Task.findByIdAndUpdate(habit._id.toString(), newData);

  res.json({ result: true, message: "Habitude modifié" });
}

module.exports = { modifyHabits };
