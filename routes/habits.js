var express = require("express");
var router = express.Router();
var moment = require("moment");

const Task = require("../models/tasks");
const Character = require("../models/characters");
const { checkBody } = require("../functions/checkbody");

//  Route GET pour l'affichage des habitudes
router.get("/", (req, res) => {
  try {
    Task.find({ creator: req.body._id, type: "Habits" })
      .select("-creator")
      .then((data) => {
        if (!data) {
          res.json({ result: false, message: "l'utillisateur n'existe pas." });
          return;
        }
        if (data === 0) {
          res.json({
            result: false,
            message: "l'utillisateur' n'a aucune habitudes.",
          });
          return;
        }
        let habits = [];
        data.forEach((data) => {
          habits.push(data);
        });
        res.json({
          result: true,
          habits,
        });
      });
  } catch (error) {
    res.json({ result: false, error: error.message });
  }
});

//  Route GET test pour la mise a jour des habitudes terminer et réalisé
router.get("/valid", async (req, res) => {
  try {
    const now = moment.utc().toDate();

    // Update tasks
    const filter = {
      creator: req.body._id,
      type: "Habits",
      isDone: true,
      endDate: { $lt: now },
      onPauseSince: null,
    };

    const tasksToUpdate = await Task.find(filter)
      .select("startDate endDate repetition")
      .lean();

    // let modifiedTasks = [];

    for (const task of tasksToUpdate) {
      const update = {
        $set: {
          startDate: task.endDate,
          endDate: moment(task.endDate)
            .utc()
            .add(task.repetition.number, task.repetition.label),
          isDone: false,
          updatedAt: now,
        },
      };

      const modifiedTask = await Task.findByIdAndUpdate(
        task._id.toString(),
        update
      );

      // modifiedTasks.push(modifiedTask);
    }

    res.json({ message: "Updated" });
  } catch (error) {
    res.json({ result: false, error: error.message });
  }
});

//  Route GET test pour la mise a jour des habitudes terminer et non réalisé
router.get("/unvalid", async (req, res) => {
  try {
    const now = moment.utc().toDate();

    // Update tasks
    const filter = {
      creator: req.body._id,
      type: "Habits",
      isDone: false,
      endDate: { $lt: now },
      onPauseSince: null,
    };

    const tasksToUpdate = await Task.find(filter)
      .select("startDate endDate repetition")
      .lean();

    // let modifiedTasks = [];

    for (const task of tasksToUpdate) {
      const update = {
        $set: {
          startDate: task.endDate,
          endDate: moment(task.endDate)
            .utc()
            .add(task.repetition.number, task.repetition.label),
          updatedAt: now,
        },
      };

      const modifiedTask = await Task.findByIdAndUpdate(
        task._id.toString(),
        update
      );

      // modifiedTasks.push(modifiedTask);
    }

    res.json({ message: "Updated" });
  } catch (error) {
    res.json({ result: false, error: error.message });
  }
});

//  Route POST pour la creation d'une habitude
router.post("/create", (req, res) => {
  if (!checkBody(req.body, ["name", "number", "label"])) {
    res.json({ result: false, message: "Champs manquants" });
    return;
  }
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
    startDate,
  } = req.body;

  if (
    label !== "days" &&
    label !== "weeks" &&
    label !== "months" &&
    label !== "years"
  ) {
    res.json({ result: false, message: "Le 'label' n'est pas valide" });
    return;
  }

  try {
    Task.findOne({
      creator: _id,
      _id: taskId,
    }).then((data) => {
      if (!data) {
        // const startDate = new Date();
        const endDate = moment(startDate).add(number, label);
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

        newTask.save().then(() => {
          res.json({ result: true });
        });
      } else {
        res.json({
          result: false,
          message: "Cette habitude existe déja.",
        });
      }
    });
  } catch (error) {
    res.json({ result: false, error: error.message });
  }
});

//  Route POST pour la mise en pause d'une habitude
router.post("/pause", (req, res) => {
  if (!checkBody(req.body, ["name", "taskId", "token"])) {
    res.json({ result: false, message: "Champs manquants" });
    return;
  }
  const { taskId, _id, PauseEndDate, pauseDesc } = req.body;
  try {
    Task.findOne({
      creator: _id,
      _id: taskId,
    }).then((data) => {
      if (data) {
        if (data.onPauseSince) {
          res.json({
            result: false,
            message: "cette habitude est déjà en pause",
          });
          return;
        }
        Task.updateOne(
          { _id: data._id },
          {
            updatedAt: new Date(),
            onPauseSince: new Date(),
            PauseEndDate,
            pauseDesc,
          }
        ).then(() => {
          res.json({ result: true });
        });
      } else {
        res.json({ result: false, message: "Cette habitude n'existe pas." });
      }
    });
  } catch (error) {
    res.json({ result: false, error: error.message });
  }
});

//  Route POST pour retirer la pause d'une habitude
router.post("/unpause", (req, res) => {
  if (!checkBody(req.body, ["name", "taskId", "token"])) {
    res.json({ result: false, message: "Champs manquants" });
    return;
  }

  const { taskId, _id } = req.body;
  try {
    Task.findOne({
      creator: _id,
      _id: taskId,
    }).then((data) => {
      if (data) {
        if (data.onPauseSince === null) {
          res.json({
            result: false,
            message: "cette habitude n'est pas en pause",
          });
          return;
        }
        Task.updateOne(
          { _id: data._id },
          {
            updatedAt: new Date(),
            onPauseSince: null,
            PauseEndDate: null,
            pauseDesc: null,
          }
        ).then(() => {
          res.json({ result: true });
        });
      } else {
        res.json({ result: false, message: "Cette habitude n'existe pas." });
      }
    });
  } catch (error) {
    res.json({ result: false, error: error.message });
  }
});

//  Route GET test pour la mise a jour des habitudes dont la date de pause est depassé
router.get("/unpauseauto", async (req, res) => {
  try {
    const now = moment.utc().toDate();

    // Update tasks
    const filter = {
      creator: req.body._id,
      type: "Habits",
      PauseEndDate: { $lt: now },
    };

    const tasksToUpdate = await Task.find(filter)
      .select("PauseEndDate pauseDesc onPauseSince")
      .lean();

    // let modifiedTasks = [];

    for (const task of tasksToUpdate) {
      const update = {
        $set: {
          onPauseSince: null,
          PauseEndDate: null,
          pauseDesc: null,
          updatedAt: now,
        },
      };

      const modifiedTask = await Task.findByIdAndUpdate(
        task._id.toString(),
        update
      );

      // modifiedTasks.push(modifiedTask);
    }

    res.json({ message: "Updated" });
  } catch (error) {
    res.json({ result: false, error: error.message });
  }
});

//  Route POST pour la modification d'une habitude
router.post("/modify", (req, res) => {
  if (!checkBody(req.body, ["name", "taskId", "number", "label", "token"])) {
    res.json({ result: false, message: "Champs manquants" });
    return;
  }
  const {
    taskId,
    _id,
    name,
    description,
    endDate,
    tags,
    difficulty,
    number,
    label,
    isFavorite,
    PauseEndDate,
    pauseDesc,
  } = req.body;
  try {
    Task.findOne({
      creator: _id,
      _id: taskId,
    }).then((data) => {
      if (data) {
        Task.updateOne(
          { _id: data._id },
          {
            name,
            description,
            endDate,
            updatedAt: new Date(),
            tags,
            difficulty,
            repetition: {
              number,
              label,
            },
            isFavorite,
            PauseEndDate,
            pauseDesc,
          }
        ).then((data) => {
          res.json({ result: true, data });
        });
      } else {
        res.json({ result: false, message: "Cette habitude n'existe pas." });
      }
    });
  } catch (error) {
    res.json({ result: false, error: error.message });
  }
});

//  Route POST pour la validation d'une habitude
router.post("/isdone", async (req, res) => {
  if (!checkBody(req.body, ["taskId"])) {
    res.json({ result: false, message: "Champs manquants" });
    return;
  }
  try {
    const { taskId, _id } = req.body;

    const habit = await Task.findOne({
      creator: _id,
      _id: taskId,
    });

    if (!habit) {
      console.log("Habitudes non trouvée");
      res.status.json({ result: false, error: "Tâche non trouvée" });
      return;
    }

    const newIsDone = !habit.isDone;

    const pointsAndCoins = habit.difficulty;

    await Task.updateOne({ creator: _id, _id: taskId }, { isDone: newIsDone });

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
  } catch (err) {
    console.error(err);
    res.json({ result: false, error: err.message });
  }
});

//  Route POST pour liker une habitude
router.post("/like", (req, res) => {
  if (!checkBody(req.body, ["taskId"])) {
    res.json({ result: false, message: "Champs manquants" });
    return;
  }
  const { taskId, _id } = req.body;
  try {
    Task.findOne({
      creator: _id,
      _id: taskId,
    }).then((data) => {
      if (data) {
        Task.updateOne(
          { _id: data._id },
          {
            isFavorite: !data.isFavorite,
          }
        ).then(() => {
          res.json({ result: true });
        });
      } else {
        res.json({ result: false, message: "la data n'existe pas." });
      }
    });
  } catch (error) {
    res.json({ result: false, error: error.message });
  }
});

module.exports = router;
