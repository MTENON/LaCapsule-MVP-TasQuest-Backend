const Task = require("../../models/tasks");
const Character = require("../../models/characters");

async function doneHabits(obj, res) {
  const { taskId, _id } = obj;

  const habit = await Task.findOne({
    creator: _id,
    _id: taskId,
  });

  if (!habit) {
    res.status.json({ result: false, error: "L'habitude n'existe pas." });
    return;
  }

  const pointsAndCoins = habit.difficulty;

  await Task.updateOne(
    { creator: _id, _id: taskId },
    { isDone: !habit.isDone }
  );

  const character = await Character.findOne({ user: _id });

  if (!character) {
    res.status.json({
      result: false,
      error: "Personnage non trouvé",
    });
    return;
  }

  const characterUpdate = {
    $inc: {
      "caracteristics.XP": newIsDone ? pointsAndCoins : -pointsAndCoins,
      money: newIsDone ? pointsAndCoins : -pointsAndCoins,
    },
  };

  await Character.updateOne({ _id: character._id }, characterUpdate);

  res.json({ result: true, isDone: habit.isDone });
}

module.exports = { doneHabits };
