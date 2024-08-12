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
    // startDate,
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
    _id: taskId,
    type: "Habits",
  };

  const habit = await Task.findOne(filter).lean();

  if (habit) {
    res.json({
      result: false,
      message: "Cette habitude existe déja.",
    });
    return;
  }

  const startDate = moment().utc();
  const endDate = moment(startDate).utc().add(number, label);
  console.log(endDate);

  const newTask = new Task({
    creator: _id,
    type: "Habits",
    name,
    description,
    startDate,
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

  res.json({ result: true, message: "habitude créer" });
}

module.exports = { createHabits };
