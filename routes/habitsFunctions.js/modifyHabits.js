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
    PauseEndDate,
    pauseDesc,
  } = obj;

  const endDate = moment(data.startDate).utc().add(number, label);

  const filter = {
    creator: _id,
    type: "Habits",
    _id: taskId,
  };

  const newData = {
    name,
    description,
    endDate,
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

  const habit = await Task.findOne(filter).lean();

  if (!habit) {
    res.json({
      result: false,
      message: "Cette habitude n'existe pas.",
    });
    return;
  }

  await Task.updateOne({ _id: data._id }, { newData });

  res.json({ result: true, message: "Habitude modifié" });
}

module.exports = { modifyHabits };
