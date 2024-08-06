var express = require("express");
var router = express.Router();

const Task = require("../models/tasks");
const User = require("../models/users");
const { checkBody } = require("../functions/checkbody");

//  Route post pour la creation d'une habitude
router.post("/create", (req, res) => {
  if (!checkBody(req.body, ["name", "number", "label"])) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }

  const {
    token,
    name,
    description,
    tags,
    dificulty,
    number,
    label,
    isFavorite,
  } = req.body;

  try {
    User.findOne({ token }).then((user) => {
      if (!user) {
        res.json({ result: false, error: "User not found" });
        return;
      }
      const creator = user._id;
      Task.findOne({ creator, name: { $regex: new RegExp(name, "i") } }).then(
        (data) => {
          if (!data) {
            const newTask = new Task({
              creator,
              name,
              description,
              tags,
              dificulty,
              repetition: {
                number,
                label,
              },
              isFavorite,
              type: "Habitudes",
            });

            newTask.save().then((data) => {
              res.json({
                result: true,
                habits: {
                  creator: data.creator,
                  name: data.name,
                  description: data.description,
                  tags: data.tags,
                  dificulty: data.dificulty,
                  repetition: {
                    number: data.repetition.number,
                    label: data.repetition.label,
                  },
                  isFavorite: data.isFavorite,
                  type: data.type,
                },
              });
            });
          } else {
            res.json({
              result: false,
              errorMsg: "Cette habitude existe déja.",
            });
          }
        }
      );
    });
  } catch (error) {
    // alert(error.message);
    res.json({ result: false, error: error.message });
  }
});

//  Route post pour la modification d'une habitude
router.post("/modify", (req, res) => {
  if (!checkBody(req.body, ["name", "number", "label"])) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }
  const {
    token,
    name,
    newName,
    description,
    tags,
    dificulty,
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
        { creator, name: { $regex: new RegExp(name, "i") } },
        {
          name: newName,
          description,
          tags,
          dificulty,
          repetition: {
            number,
            label,
          },
          isFavorite,
        }
      ).then(() => {
        Task.findOne({
          creator,
          name: { $regex: new RegExp(newName, "i") },
        }).then((data) => {
          res.json({
            result: true,
            habits: {
              creator: data.creator,
              name: data.name,
              description: data.description,
              tags: data.tags,
              dificulty: data.dificulty,
              repetition: {
                number: data.repetition.number,
                label: data.repetition.label,
              },
              isFavorite: data.isFavorite,
              type: data.type,
            },
          });
        });
      });
    });
  } catch (error) {
    // alert(error.message);
    res.json({ result: false, error: error.message });
  }
});

//  Route post pour la mise en pause d'une habitude
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
      Task.updateOne(
        { creator, name: { $regex: new RegExp(name, "i") } },
        {
          onPauseSince: new Date(),
          endDate,
          pauseDesc,
        }
      ).then(() => {
        Task.findOne({
          creator,
          name: { $regex: new RegExp(name, "i") },
        }).then((data) => {
          res.json({
            result: true,
            habits: {
              creator: data.creator,
              name: data.name,
              description: data.description,
              tags: data.tags,
              dificulty: data.dificulty,
              repetition: {
                number: data.repetition.number,
                label: data.repetition.label,
              },
              isFavorite: data.isFavorite,
              onPauseSince: data.onPauseSince,
              endDate: data.endDate,
              pauseDesc: data.pauseDesc,
              type: data.type,
            },
          });
        });
      });
    });
  } catch (error) {
    // alert(error.message);
    res.json({ result: false, error: error.message });
  }
});

module.exports = router;
