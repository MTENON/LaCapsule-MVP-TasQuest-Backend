var express = require("express");
var router = express.Router();

const Task = require("../models/tasks");
const User = require("../models/users");
const { checkBody } = require("../functions/checkbody");

router.post("/test", (req, res) => {
  res.json({ body: req.body });
});

//  Route GET pour l'affichage des habitudes
router.get("/", (req, res) => {
  try {
    Task.find({ creator: req.body._id, type: "Habits" }).then((data) => {
      if (data) {
        console.log("true =>", req.body._id);
        const tab = data.map((e) => {
          res.json({
            result: true,
            habits: e,
          });
        });
      } else {
        console.log("false =>", req.body._id);
        res.json({ result: false, error: "No data" });
      }
    });
  } catch (error) {
    res.json({ result: false, error: error.message });
  }
});

//  Route post pour la creation d'une habitude
router.post("/create", (req, res) => {
  if (!checkBody(req.body, ["name", "number", "label", "token"])) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }

  const {
    token,
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
      name: { $regex: new RegExp(name, "i") },
    }).then((data) => {
      if (!data) {
        const newTask = new Task({
          creator: req.body._id,
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

        newTask.save().then((data) => {
          res.json({ result: true, data });
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
  if (!checkBody(req.body, ["name", "token"])) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }
  const { token, name, endDate, pauseDesc } = req.body;
  try {
    User.findOne({ token }).then((user) => {
      if (!user) {
        res.json({ result: false, error: "Token invalide" });
        return;
      }
      const creator = user._id;
      Task.findOne({ creator, name: { $regex: new RegExp(name, "i") } }).then(
        (data) => {
          if (data) {
            Task.updateOne(
              { name: { $regex: new RegExp(name, "i") } },
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
        }
      );
    });
  } catch (error) {
    res.json({ result: false, error: error.message });
  }
});

//  Route POST pour retirer la pause d'une habitude
router.post("/unpause", (req, res) => {
  if (!checkBody(req.body, ["name", "token"])) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }
  const { token, name, endDate, pauseDesc } = req.body;
  try {
    User.findOne({ token }).then((user) => {
      if (!user) {
        res.json({ result: false, error: "Token invalide" });
        return;
      }
      const creator = user._id;
      Task.updateOne(
        { creator, name: { $regex: new RegExp(name, "i") } },
        {
          updatedAt: new Date(),
          onPauseSince: null,
          endDate: null,
          pauseDesc: null,
        }
      ).then(() => {
        res.json({ result: true });
      });
    });
  } catch (error) {
    res.json({ result: false, error: error.message });
  }
});

//  Route POST pour la modification d'une habitude
router.post("/modify", (req, res) => {
  if (!checkBody(req.body, ["name", "number", "label", "token"])) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }
  const {
    token,
    name,
    oldName,
    description,
    tags,
    difficulty,
    number,
    label,
    isFavorite,
  } = req.body;
  try {
    User.findOne({ token }).then((user) => {
      if (!user) {
        res.json({ result: false, error: "Token invalide" });
        return;
      }
      const creator = user._id;
      Task.updateOne(
        { creator, name: { $regex: new RegExp(oldName, "i") } },
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
        }
      ).then(() => {
        res.json({ result: true });
      });
    });
  } catch (error) {
    res.json({ result: false, error: error.message });
  }
});

module.exports = router;
