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

  const habit = await Task.findOne(filter).select("startDate").lean();

  // const endDate = moment(habit.startDate).utc().add(number, label);

  const newData = {
    name,
    description,
    endDate: moment(startDate).utc().add(number, label),
    updatedAt: moment().utc(),
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

  await Task.updateOne({ _id: habit._id }, { newData });

  res.json({ result: true, message: "Habitude modifié" });
}

module.exports = { modifyHabits };
