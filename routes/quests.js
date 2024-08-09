var express = require('express');
var router = express.Router();

const Quest = require('../models/quests');
const { randomNumber } = require('../functions/randomNumber')

router.get('/', async (req, res) => {
    const questData = await Quest.find({});
    if (questData.length > 0) {
        res.json({ result: true, data: questData });
    } else {
        res.json({ result: false, data: 'No data' });
    }
});

router.get('/threeQuests', async (req, res) => {

    try {
        const questData = await Quest.find({});
        if (questData.length > 0) {

            const questOne = await questData.filter((e) => e.difficulty === 1);
            const questTwo = await questData.filter((e) => e.difficulty === 2);
            const questThree = await questData.filter((e) => e.difficulty === 3);

            const questLevelOne = await questOne[randomNumber(0, questOne.length)]
            const questLevelTwo = await questTwo[randomNumber(0, questTwo.length)]
            const questLevelThree = await questThree[randomNumber(0, questThree.length)]

            res.json({ result: true, questOne: questLevelOne, questTwo: questLevelTwo, questThree: questLevelThree });
        } else {
            res.json({ result: false, data: 'No data' });
        }

    } catch (error) {
        res.json({ result: false, error: error });
    }
});

router.get('/:questId', async (req, res) => {

    try {

        const questData = await Quest.findById(req.params.questId);

        if (questData === null || questData === undefined) {
            res.json({ result: false, data: 'No quest found' });
        }

        res.json({ result: true, data: questData });

    } catch (error) {
        res.json({ result: false, error: error });
    }

});

module.exports = router;
