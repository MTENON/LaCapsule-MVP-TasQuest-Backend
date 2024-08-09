var express = require('express');
var router = express.Router();

const Quest = require('../models/quests');

router.get('/quests', async (req, res) => {
    const questData = await Quest.find({});
    res.json({ result: true, data: questData });
});


module.exports = router;
