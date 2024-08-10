var express = require('express');
var router = express.Router();

//Imports mongoose
const User = require('../models/users');
const Character = require('../models/characters')

//Import de dépendances
const uid2 = require('uid2');
const bcrypt = require('bcrypt')

//Import de fonctions
const { checkBody } = require("../functions/checkbody");
const Class = require('../models/classes');
const Carac = require('../models/caracs');

/* GET users listing. */
router.get('/', (req, res) => {
  res.send('respond with a resource');
});

// --- ROUTE SIGNUP --- ///
// Permet la création de compte d'un utilisateur

router.post('/signup', async (req, res) => {

  if (!checkBody(req.body, ['username', 'password', 'email', 'characterName', 'choosedPic', 'class'])) {
    res.status(412);
    res.json({ result: false, data: 'checkbody returned false' });
    return;
  }

  // ------------------------------- //
  // --- Création du profil user --- //
  // ------------------------------- //

  const userExist = await User.findOne(
    {
      $or: [
        { username: req.body.username },
        { email: req.body.email }
      ]
    }
  )

  if (await userExist !== null) {
    res.json({ result: false, data: 'user already exist' });
    return;
  }

  const newUser = await new User({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 10),
    token: uid2(32),
    createdAt: new Date(),
    updatedAt: new Date(),
    lastConnectionAt: new Date(),
  });

  const newUserData = await newUser.save();
  /*
  "newUserData": {
    "username": "Sonata",
    "email": "test@gmail.com",
    "password": "$2b$10$cOu.aL2V6EAwO051bwCugOjgRcTpWSthhVP1KMQDvkhMkWv/fl032",
    "token": "RjNpg2C5xfk0vyx6feL9l67ArmEYLTXp",
    "createdAt": "2024-08-07T10:37:18.678Z",
    "updatedAt": "2024-08-07T10:37:18.678Z",
    "lastConnectionAt": "2024-08-07T10:37:18.678Z",
    "_id": "66b34e5eceec6a8d3f7ab3b2",
    "__v": 0
  */

  const choosedClassId = await Class.findOne({ name: req.body.class.name })

  const caracteristics = await Carac.find({})
  /*
    "caracteristics": [
      {
        "_id": "66b3349a9762ea8f0f8c62a9",
        "name": "Force",
        "description": "Mesure la puissance physique et la capacité à effectuer des actions de force brute."
      },
      {
        "_id": "66b3349a9762ea8f0f8c62aa",
        "name": "Adresse",
        "description": "Représente l'agilité, la précision et la dextérité manuelle."
      },
      {
        "_id": "66b3349a9762ea8f0f8c62ab",
        "name": "Intelligence",
        "description": "Évalue la capacité mentale, la connaissance et les compétences magiques."
      },
      {
        "_id": "66b3349a9762ea8f0f8c62ac",
        "name": "Sagesse",
        "description": "Indique la perception, la perspicacité et le jugement."
      }
    ]
  */

  const caractersticsIds = [];
  await caracteristics.map(data => caractersticsIds.push({ carac: data._id, level: 0 }))

  const newCharacter = await new Character({
    name: req.body.characterName,
    class: choosedClassId,
    user: newUserData._id,
    caracteristics: { caracs: caractersticsIds },
    equipment: {},
    quest: null
  })

  /*
{
  "newCharacterData": {
    "name": "Angelique",
    "class": {
      "_id": "66b331709762ea8f0f8c622a",
      "name": "Mage",
      "image": "https://via.placeholder.com/300",
      "icon": "https://via.placeholder.com/150",
      "skills": [
        "66b32fe79762ea8f0f8c6220",
        "66b32fe79762ea8f0f8c6221",
        "66b32fe79762ea8f0f8c6222"
      ]
    },
    "user": "66b3523749b5a6f78c6ad373",
    "caracteristics": {
      "level": 1,
      "HP": 10,
      "XP": 0,
      "caracs": [
        {
          "carac": "66b3349a9762ea8f0f8c62a9",
          "level": 0,
          "_id": "66b3523749b5a6f78c6ad379"
        },
        {
          "carac": "66b3349a9762ea8f0f8c62aa",
          "level": 0,
          "_id": "66b3523749b5a6f78c6ad37a"
        },
        {
          "carac": "66b3349a9762ea8f0f8c62ab",
          "level": 0,
          "_id": "66b3523749b5a6f78c6ad37b"
        },
        {
          "carac": "66b3349a9762ea8f0f8c62ac",
          "level": 0,
          "_id": "66b3523749b5a6f78c6ad37c"
        }
      ],
      "_id": "66b3523749b5a6f78c6ad378"
    },
    "money": 5,
    "inventory": [],
    "equipment": {
      "necklace": null,
      "head": null,
      "hand1": null,
      "body": null,
      "hand2": null,
      "bracelet": null,
      "feets": null,
      "ring": null,
      "_id": "66b3523749b5a6f78c6ad37d"
    },
    "quest": null,
    "_id": "66b3523749b5a6f78c6ad377",
    "skills": [],
    "__v": 0
  }
}
  */

  const newCharacterData = await newCharacter.save();

  const returnData = {
    username: newUserData.username,
    token: newUserData.token,
    characterId: newCharacterData._id,
    money: newCharacterData.money,
    HP: newCharacterData.caracteristics.HP,
    XP: newCharacterData.caracteristics.XP,
    caracs: {
      0: newCharacterData.caracteristics.caracs[0].level,
      1: newCharacterData.caracteristics.caracs[1].level,
      2: newCharacterData.caracteristics.caracs[2].level,
      3: newCharacterData.caracteristics.caracs[3].level
    }
  }
  res.json({ result: true, data: returnData })

})

// --- ROUTE SIGN IN --- ///
// Permet l'authentification d'un utilisateur déjà enregistré

router.post('/signin', async (req, res) => {

  if (checkBody(req.body, ['username', 'password']) || checkBody(req.body, ['email', 'password'])) {

  } else {
    res.status(412);
    res.json({ result: false, data: 'checkbody returned false' });
    return;
  };

  const data = await User.findOne({
    $or:
      [{ username: req.body.username },
      { email: req.body.username }]
  })

  if (!data) {
    res.json({ result: false, data: 'No user in database' })
    return;
  } else if (data && !bcrypt.compareSync(req.body.password, data.password)) {
    res.json({ result: false, error: 'wrong password' })
  } else if (data && bcrypt.compareSync(req.body.password, data.password)) {

    await User.updateOne({
      $or:
        [{ username: req.body.username },
        { email: req.body.username }]
    },
      { token: uid2(32) })

    await User.updateOne({
      $or:
        [{ username: req.body.username },
        { email: req.body.username }]
    },
      { lastConnectionAt: new Date() })

  }

  const dataUpdate = await User.findOne({
    $or:
      [{ username: req.body.username },
      { email: req.body.username }]
  })

  if (!dataUpdate) {
    res.json({ result: false, data: 'No user in database' })
    return;
  }

  const characterData = await Character.findOne({ user: dataUpdate._id })

  const result = {
    username: dataUpdate.username,
    token: dataUpdate.token,
    characterId: characterData._id,
    characterName: characterData.name,
    money: characterData.money,
    HP: characterData.caracteristics.HP,
    XP: characterData.caracteristics.XP,
    caracs: characterData.caracteristics.caracs,
    questId: characterData.quest
  }
  res.json({ result: true, data: result })

});

// --- ROUTE LOGOUT --- ///
// Permet la déconnection de l'utilisateur

router.delete('/logout', async (req, res) => {

  try {
    const userData = await User.updateOne({ token: req.body.token }, { token: "" })
    if (userData === null || userData === undefined) {
      res.json({ result: false, data: 'No data' })
    }
    res.json({ result: true, data: userData });
  } catch (error) {
    alert(error.message);
  }
})


module.exports = router;
