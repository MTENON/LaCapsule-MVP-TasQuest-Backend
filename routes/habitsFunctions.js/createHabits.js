var moment = require("moment");
const Task = require("../../models/tasks");

async function createHabits(obj, res) {
  const {
    taskId,
    name,
    description,
    tags,
    difficulty,
    number,
    label,
    isFavorite,
    _id,
    startDate,
  } = obj;

  if (
    label !== "days" &&
    label !== "weeks" &&
    label !== "months" &&
    label !== "years"
  ) {
    res.json({ result: false, message: "Le 'label' n'est pas valide" });
    return;
  }

  const filter = {
    creator: obj._id,
    type: "Habits",
    _id: taskId,
  };

  const habit = await Task.find(filter)
    .select("startDate endDate repetition")
    .lean();

  if (habit) {
    res.json({
      result: false,
      message: "Cette habitude existe déja.",
    });
    return;
  }

  const endDate = moment(startDate).utc().add(number, label);
  console.log(endDate);
  const newTask = new Task({
    creator: _id,
    type: "Habits",
    name,
    description,
    startDate: moment().utc().add(),
    endDate,
    tags,
    difficulty,
    repetition: {
      number,
      label,
    },
    isFavorite,
  });

  await newTask.save();

  res.json({ result: true });
}

module.exports = { createHabits };
