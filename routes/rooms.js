var express = require('express');
var router = express.Router();

const Item = require('../models/items')

router.get('/items', async (req, res) => {
    const data = await Item.find({})
    res.json({ result: true, data: data })
});


module.exports = router;
