const Task = require("../../models/tasks");

async function getHabits(obj, res) {
  const habits = await Task.find({ creator: obj._id, type: "Habits" })
    .select("-creator")
    .lean();

  if (habits === null) {
    res.json({ result: false, message: "L'utillisateur n'existe pas." });
    return;
  } else if (habits === 0) {
    res.json({
      result: false,
      message: "l'utillisateur' n'a aucune habitudes.",
    });
    return;
  }

  const habitsData = [];

  await habits.forEach((e) => {
    habitsData.push(e);
  });

  res.json({ result: true, message: "habitude fetcher", habits });
}

module.exports = { getHabits };
