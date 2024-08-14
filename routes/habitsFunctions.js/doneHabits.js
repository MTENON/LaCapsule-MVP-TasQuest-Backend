var moment = require("moment");
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

  const now = moment.utc().toDate();

  const pointsAndCoins = habit.difficulty;

  await Task.updateOne(
    { creator: _id, _id: taskId },
    { isDone: !habit.isDone, updatedAt: now }
  );

  const character = await Character.findOne({ user: _id });

  if (!character) {
    res.status.json({
      result: false,
      message: "Personnage non trouvé",
    });
    return;
  }

  const newMoney = newIsDone
    ? character.money + pointsAndCoins
    : character.money - pointsAndCoins;

  const newXP = newIsDone
    ? character.caracteristics.XP + pointsAndCoins
    : character.caracteristics.XP - pointsAndCoins;

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
    money: newMoney,
    XP: newXP,
  });
}

module.exports = { doneHabits };
