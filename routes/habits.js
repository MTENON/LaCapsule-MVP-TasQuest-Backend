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
    urgent,
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
              urgent,
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
        }
      );
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
        res.json({ result: false, error: "User not found" });
        return;
      }
      const creator = user._id;
      Task.updateOne(
        { creator, name: {  $regex: new RegExp(name, "i") } },
        {
          name: newName,
          description,
          tags,
          dificulty,
          number,
          label,
          isFavorite,
        }
      ).then(() => {
        Task.find().then((data) => {
          res.json({ result: true, data });
        });
      });
    });
  } catch (error) {
    // alert(error.message);
    res.json({ result: false, error: error.message });
  }
});

module.exports = router;
