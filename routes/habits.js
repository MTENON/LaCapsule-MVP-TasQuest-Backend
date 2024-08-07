var express = require("express");
var router = express.Router();

const Task = require("../models/tasks");
const { checkBody } = require("../functions/checkbody");

router.post("/test", (req, res) => {
  res.json({ body: req.body });
});

//  Route GET pour l'affichage des habitudes
router.get("/", (req, res) => {
  try {
    Task.find({ creator: req.body._id, type: "Habits" }).then((data) => {
      if (data) {
        const tab = data.map((habits) => {
          res.json({
            result: true,
            habits,
          });
        });
      } else {
        res.json({ result: false, error: "No data" });
      }
    });
  } catch (error) {
    res.json({ result: false, error: error.message });
  }
});

//  Route post pour la creation d'une habitude
router.post("/create", (req, res) => {
  if (!checkBody(req.body, ["name", "number", "label"])) {
    res.json({ result: false, error: "Champs manquants" });
    return;
  }

  const {
    key,
    name,
    description,
    tags,
    difficulty,
    number,
    label,
    isFavorite,
    _id,
  } = req.body;

  try {
    Task.findOne({
      creator: req.body._id,
      _id: key,
    }).then((data) => {
      if (!data) {
        const newTask = new Task({
          creator: _id,
          type: "Habits",
          name,
          description,
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
          errorMsg: "Cette habitude existe déja.",
        });
      }
    });
  } catch (error) {
    res.json({ result: false, error: error.message });
  }
});

//  Route POST pour la mise en pause d'une habitude
router.post("/pause", (req, res) => {
  if (!checkBody(req.body, ["name", "key", "token"])) {
    res.json({ result: false, error: "Champs manquants" });
    return;
  }
  const { key, _id, endDate, pauseDesc } = req.body;
  try {
    Task.findOne({
      creator: _id,
      _id: key,
    }).then((data) => {
      if (data) {
        if (data.onPauseSince) {
          res.json({
            result: false,
            error: "cette habitude est déjà en pause",
          });
          return;
        }
        Task.updateOne(
          { _id: data._id },
          {
            updatedAt: new Date(),
            onPauseSince: new Date(),
            endDate,
            pauseDesc,
          }
        ).then(() => {
          res.json({ result: true });
        });
      } else {
        res.json({ result: false, error: "Cette habitude n'existe pas." });
      }
    });
  } catch (error) {
    res.json({ result: false, error: error.message });
  }
});

//  Route POST pour retirer la pause d'une habitude
router.post("/unpause", (req, res) => {
  if (!checkBody(req.body, ["name", "key", "token"])) {
    res.json({ result: false, error: "Champs manquants" });
    return;
  }

  const { key, _id } = req.body;
  try {
    Task.findOne({
      creator: _id,
      _id: key,
    }).then((data) => {
      if (data) {
        if (data.onPauseSince === null) {
          res.json({
            result: false,
            error: "cette habitude n'est pas en pause",
          });
          return;
        }
        Task.updateOne(
          { _id: data._id },
          {
            updatedAt: new Date(),
            onPauseSince: null,
            endDate: null,
            pauseDesc: null,
          }
        ).then(() => {
          res.json({ result: true });
        });
      } else {
        res.json({ result: false, error: "Cette habitude n'existe pas." });
      }
    });
  } catch (error) {
    res.json({ result: false, error: error.message });
  }
});

//  Route POST pour la modification d'une habitude
router.post("/modify", (req, res) => {
  if (!checkBody(req.body, ["name", "key", "number", "label", "token"])) {
    res.json({ result: false, error: "Champs manquants" });
    return;
  }
  const {
    key,
    _id,
    name,
    description,
    tags,
    difficulty,
    number,
    label,
    isFavorite,
    endDate,
    pauseDesc,
  } = req.body;
  try {
    Task.findOne({
      creator: _id,
      _id: key,
    }).then((data) => {
      if (data) {
        Task.updateOne(
          { _id: data._id },
          {
            name,
            description,
            updatedAt: new Date(),
            tags,
            difficulty,
            repetition: {
              number,
              label,
            },
            isFavorite,
            endDate,
            pauseDesc,
          }
        ).then((data) => {
          res.json({ result: true, data });
        });
      } else {
        res.json({ result: false, error: "Cette habitude n'existe pas." });
      }
    });
  } catch (error) {
    res.json({ result: false, error: error.message });
  }
});

module.exports = router;
