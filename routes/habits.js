var express = require("express");
var router = express.Router();

const { checkBody } = require("../functions/checkbody");

// if (!checkBody(req.body, ['name', 'email', 'password'])) {
//     res.json({ result: false, error: 'Missing or empty fields' });
//     return;
// }

const Task = require("../models/tasks");

router.post("/create", (req, res) => {
  // Verification de la validiter des infos envoyer par le body
  if (!checkBody(req.body, ["name", "number", "label"])) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }

  // Destructuration des infos envoyer par le body
  const {
    // token,
    name,
    description,
    tags,
    dificulty,
    number,
    label,
    toDo,
    isFavorite,
    urgent,
  } = req.body;

  try {
    // Verification que l'habitude n'existe pas déja
    Task.findOne({
      name: { $regex: new RegExp(name, "i") },
    })
    .then((data) => {
      if (!data) {
        const newTask = new Task({
          name,
          description,
          tags,
          dificulty,
          number,
          label,
          toDo,
          isFavorite,
          urgent,
        });

        newTask.save().then((data) => {
          res.json({ data });
        });
      } else {
        res.json({ result: false, errorMsg: "Cette habitude existe déja." });
      }
    });
  } catch (error) {
    alert(error.message);
  }
});

module.exports = router;
