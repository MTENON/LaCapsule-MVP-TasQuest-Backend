var express = require("express");
var router = express.Router();

const Class = require("../models/classes");

router.get('/', (req, res) => {
    Class.find({}).then(data => res.json({ data }))
})

module.exports = router;