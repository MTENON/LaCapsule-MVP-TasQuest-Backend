const Task = require("../../models/tasks");

async function deleteHabits(obj, res) {
  const { taskId, _id } = obj;

  const habit = await Task.findOne({
    creator: _id,
    _id: taskId,
  });

  if (!habit) {
    res.json({ result: false, message: "Habitude non trouvée" });
    return;
  }

  await Task.deleteOne({ creator: _id, _id: taskId });

  if (habit.deletedCount < 0) {
    res.json({ result: false, message: "erreur lors de la suppression", habit });
    return;
  }

  res.json({ result: true, message: "habitude supprimer"});
}

module.exports = { deleteHabits };
