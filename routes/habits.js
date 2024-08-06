var express = require("express");
var router = express.Router();

const Task = require("../models/tasks");
const { checkBody } = require("../functions/checkbody");

//  Route post pour la creation d'une habitude
router.post("/create", (req, res) => {
  // Verification de la validiter des infos envoyer par le body
  if (!checkBody(req.body, ["name", "number", "label"])) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }

  // Destructuration des infos envoyer par le body
  const {
    name,
    description,
    tags,
    dificulty,
    number,
    label,
    isFavorite,
    urgent,
  } = req.body;

  try {
    // Verification que l'habitude n'existe pas déja
    Task.findOne({
      name: { $regex: new RegExp(name, "i") },
    }).then((data) => {
      // Creation de l'habitude dans la base de donnée 
      if (!data) {
        const newTask = new Task({
          name,
          description,
          tags,
          dificulty,
          repetition : {
            number,
            label
          },
          isFavorite,
          urgent,
        });

        newTask.save().then((data) => {
          res.json({ result: true, data });
        });
      } else {
        res.json({ result: false, errorMsg: "Cette habitude existe déja." });
      }
    });
  } catch (error) {
    alert(error.message);
  }
});

router.post("/modify", (req, res) => {
  // Verification de la validiter des infos envoyer par le body
  if (!checkBody(req.body, ["name", "number", "label"])) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }

  // Destructuration des infos envoyer par le body
  const {
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
    Task.updateOne(
      { name: { $regex: new RegExp(name, "i") } },
      { name: newName, description, tags, dificulty, number, label, isFavorite }
    ).then(() => {
      Task.find().then((data) => {
        res.json({ result: true, data });
      });
    });
  } catch (error) {
    alert(error.message);
  }
});

module.exports = router;
