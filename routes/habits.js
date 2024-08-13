var express = require("express");
var router = express.Router();

// <----------------> FONCTION DES ROUTES <----------------> \\
const { checkBody } = require("../functions/checkbody");
const { getHabits } = require("./habitsFunctions.js/getHabits");
const { validUpdate } = require("./habitsFunctions.js/validUpdate");
const { unvalidUpdate } = require("./habitsFunctions.js/unvalidUpdate");
const { createHabits } = require("./habitsFunctions.js/createHabits");
const { pauseHabits } = require("./habitsFunctions.js/pauseHabits");
const { unpauseHabits } = require("./habitsFunctions.js/unpauseHabits");
const { unpauseHabitsAuto } = require("./habitsFunctions.js/unpauseHabitsAuto");
const { modifyHabits } = require("./habitsFunctions.js/modifyHabits");
const { doneHabits } = require("./habitsFunctions.js/doneHabits");
const { likeHabits } = require("./habitsFunctions.js/likeHabits");
const { deleteHabits } = require("./habitsFunctions.js/deleteHabits");

//  Route GET pour l'affichage des habitudes
router.get("/", (req, res) => {
  try {
    getHabits(req.body, res);
  } catch (error) {
    res.json({ result: false, error: error.message });
  }
});

//  Route GET test pour la mise a jour des habitudes terminer et réalisé
router.get("/valid", async (req, res) => {
  try {
    validUpdate(req.body, res);
  } catch (error) {
    res.json({ result: false, error: error.message });
  }
});

//  Route GET test pour la mise a jour des habitudes terminer et non réalisé
router.get("/unvalid", async (req, res) => {
  try {
    unvalidUpdate(req.body, res);
  } catch (error) {
    res.json({ result: false, error: error.message });
  }
});

//  Route POST pour la creation d'une habitude
router.post("/create", (req, res) => {
  if (!checkBody(req.body, ["name", "number", "label", "startDate"])) {
    res.json({ result: false, message: "Champs manquants pour la creation" });
    return;
  }
  console.log(req.body);
  try {
    createHabits(req.body, res);
  } catch (error) {
    res.json({ result: false, message: error.message });
  }
});

//  Route POST pour la mise en pause d'une habitude
router.post("/pause", (req, res) => {
  if (!checkBody(req.body, ["taskId"])) {
    res.json({ result: false, message: "Champs manquants" });
    return;
  }

  try {
    pauseHabits(req.body, res);
  } catch (error) {
    res.json({ result: false, error: error.message });
  }
});

//  Route POST pour retirer la pause d'une habitude
router.post("/unpause", (req, res) => {
  if (!checkBody(req.body, ["taskId"])) {
    res.json({ result: false, message: "Champs manquants" });
    return;
  }
  try {
    unpauseHabits(req.body, res);
  } catch (error) {
    res.json({ result: false, error: error.message });
  }
});

//  Route GET test pour la mise a jour des habitudes dont la date de pause est depassé
router.get("/unpauseauto", async (req, res) => {
  try {
    unpauseHabitsAuto(req.body, res);
  } catch (error) {
    res.json({ result: false, error: error.message });
  }
});

//  Route POST pour la modification d'une habitude
router.post("/modify", async (req, res) => {
  if (!checkBody(req.body, ["name", "taskId", "number", "label"])) {
    res.json({ result: false, message: "Champs manquants" });
    return;
  }
  try {
    modifyHabits(req.body, res);
  } catch (error) {
    res.json({ result: false, message: error.message });
  }
});

//  Route POST pour la validation d'une habitude
router.post("/isdone", async (req, res) => {
  if (!checkBody(req.body, ["taskId"])) {
    res.json({ result: false, message: "Champs manquants" });
    return;
  }
  try {
    doneHabits(req.body, res);
  } catch (error) {
    res.json({ result: false, error: error.message });
  }
});

//  Route POST pour liker une habitude
router.post("/like", (req, res) => {
  if (!checkBody(req.body, ["taskId"])) {
    res.json({ result: false, message: "Champs manquants" });
    return;
  }
  try {
    likeHabits(req.body, res);
  } catch (error) {
    res.json({ result: false, error: error.message });
  }
});

//  Route DELETE pour supprimer une habitude
router.post("/delete", (req, res) => {
  if (!checkBody(req.body, ["taskId"])) {
    res.json({ result: false, message: "Champs manquants" });
    return;
  }
  try {
    deleteHabits(req.body, res);
  } catch (error) {
    res.json({ result: false, error: error.message });
  }
});

module.exports = router;
