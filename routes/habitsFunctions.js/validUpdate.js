var moment = require("moment");
const Task = require("../../models/tasks");

async function validUpdate(obj, res) {
  const now = moment.utc().toDate();

  // Update habits
  const filter = {
    creator: obj._id,
    type: "Habits",
    isDone: true,
    endDate: { $lt: now },
    onPauseSince: null,
  };

  const habitsToUpdate = await Task.find(filter)
    .select("startDate endDate repetition")
    .lean();

  // let modifiedHabits = [];

  for (const habit of habitsToUpdate) {
    const update = {
      $set: {
        startDate: habit.endDate,
        endDate: moment(habit.endDate)
          .utc()
          .add(habit.repetition.number, habit.repetition.label),
        isDone: false,
        updatedAt: now,
      },
    };

    // const modifiedHabit =
    await Task.findByIdAndUpdate(habit._id.toString(), update);

    // modifiedHabits.push(modifiedHabit);
  }

  res.json({ result: true, message: "Updated" });
}

module.exports = { validUpdate };
