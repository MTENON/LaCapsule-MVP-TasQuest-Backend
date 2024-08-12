var moment = require("moment");
const Task = require("../../models/tasks");

async function likeHabits(obj, res) {
  const { taskId, _id } = obj;

  const now = moment.utc().toDate();

  const habit = await Task.findOne({
    creator: _id,
    _id: taskId,
  });

  if (!habit) {
    res.json({ result: false, message: "Habitude non trouvée" });
    return;
  }

  await Task.updateOne(
    { creator: _id, _id: taskId },
    { isFavorite: !habit.isFavorite, updatedAt: now }
  );

  res.json({
    result: true,
    isFavorite: habit.isFavorite,
    message: "habitude mise a jours",
  });
}

module.exports = { likeHabits };
