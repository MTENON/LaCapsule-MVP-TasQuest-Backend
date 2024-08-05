var express = require('express');
var router = express.Router();

//Imports mongoose
const User = require('../models/users');

//Import de dépendances
const uid2 = require('uid2');
const bcrypt = require('bcrypt')

//Import de fonctions
const { checkBody } = require("../functions/checkbody")

/* GET users listing. */
router.get('/', (req, res) => {
  res.send('respond with a resource');
});


// --- ROUTE SIGNIN --- ///
// Permet la création de compte d'un utilisateur

router.post('/signin', (req, res) => {

  if (!checkBody(req.body, ['username', 'password', 'email'])) {
    res.status(412);
    res.json({ result: false, data: 'checkbody returned false' });
    return;
  }

  User.findOne(
    {
      $or: [
        { username: req.body.username },
        { email: req.body.email }
      ]
    })
    .then(data => {
      // res.json({ data, condition: (data !== null) })
      if (data !== null) {
        res.json({ result: false, data: 'user or email already exist' });
        return;
      }
    }).then(() => {

      const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 10),
        token: uid2(32),
        createdAt: new Date(),
        updatedAt: new Date(),
        lastConnectionAt: new Date(),
      });


      newUser.save().then((data) => {
        const result = { username: data.username, token: data.token }
        res.json({ result: true, data: result })
      })

    })
})

// --- ROUTE SIGNIN --- ///
// Permet l'authentification d'un utilisateur déjà enregistré

router.post('/signup', (req, res) => {

  if (checkBody(req.body, ['username', 'password']) || checkBody(req.body, ['email', 'password'])) {

  } else {
    res.status(412);
    res.json({ result: false, data: 'checkbody returned false' });
    return;
  };

  User.findOne({
    $or:
      [{ username: req.body.username },
      { email: req.body.email }]
  })
    .then((data) => {
      if (!data) {
        res.json({ result: false, data: 'No user in database' })
        return;
      } else if (data && bcrypt.compareSync(req.body.password, data.password)) {
        const result = { username: data.username, token: data.token }
        res.json({ result: true, data: result })
      } else if (data && !bcrypt.compareSync(req.body.password, data.password)) {
        res.json({ result: false, error: 'wrong password' })
      }
    })
})

module.exports = router;
