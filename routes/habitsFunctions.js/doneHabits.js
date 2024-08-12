const Task = require("../../models/tasks");
const Character = require("../../models/characters");

async function doneHabits(obj, res) {
  const { taskId, _id } = obj;

  const habit = await Task.findOne({
    creator: _id,
    _id: taskId,
  });

  if (!habit) {
    res.json({ result: false, message: "L'habitude n'existe pas." });
    return;
  }

  const newIsDone = !habit.isDone;

  const pointsAndCoins = habit.difficulty;

  await Task.updateOne(
    { creator: _id, _id: taskId },
    { isDone: !habit.isDone }
  );

  const character = await Character.findOne({ user: _id });

  if (!character) {
    res.status.json({
      result: false,
      message: "Personnage non trouvé",
    });
    return;
  }

  const characterUpdate = {
    $inc: {
      "caracteristics.XP": newIsDone ? pointsAndCoins : -pointsAndCoins,
      money: newIsDone ? pointsAndCoins : -pointsAndCoins,
    },
  };

  await Character.findByIdAndUpdate(character._id.toString(), characterUpdate);

  res.json({
    result: true,
    isDone: habit.isDone,
    message: "habitude mise a jour",
  });
}

module.exports = { doneHabits };
