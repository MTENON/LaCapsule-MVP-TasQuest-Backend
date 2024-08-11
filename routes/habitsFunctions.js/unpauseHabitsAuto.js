var moment = require("moment");
const Task = require("../../models/tasks");

async function unpauseHabitsAuto(obj, res) {
  const now = moment.utc().toDate();

  // Update habit
  const filter = {
    creator: obj._id,
    type: "Habits",
    PauseEndDate: { $lt: now },
  };

  const habitsToUpdate = await Task.find(filter)
    .select("PauseEndDate pauseDesc onPauseSince updatedAt")
    .lean();

  // let modifiedHabits = [];

  for (const habit of habitsToUpdate) {
    const update = {
      $set: {
        onPauseSince: null,
        PauseEndDate: null,
        pauseDesc: null,
        updatedAt: now,
      },
    };

    // const modifiedHabit =
    await Task.findByIdAndUpdate(habit._id.toString(), update);

    // modifiedHabits.push(modifiedHabit);
  }

  res.json({ message: "Habitudes en pause updated automatiquement" });
}

module.exports = { unpauseHabitsAuto };
