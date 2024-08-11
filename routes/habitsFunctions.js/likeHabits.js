const Task = require("../../models/tasks");

async function likeHabits(obj, res) {
  const { taskId, _id } = obj;

  const habit = await Task.findOne({
    creator: _id,
    _id: taskId,
  });

  if (!habit) {
    res.status.json({ result: false, error: "L'habitude non trouvée" });
    return;
  }

  await Task.updateOne(
    { creator: _id, _id: taskId },
    { isFavorite: !data.isFavorite }
  );

  res.json({ result: true, isFavorite: habit.isFavorite });
}

module.exports = { likeHabits };
