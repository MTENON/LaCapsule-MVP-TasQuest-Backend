var express = require('express');
var router = express.Router();

const Class = require('../models/classes');
const Skill = require('../models/skills');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

//Route test de populate les skills des class
router.get('/populateClass', (req, res) => {
  Class.find({})
    .populate('skills')
    .then(data => res.json({ data }))
});

module.exports = router;
