var express = require('express');
var router = express.Router();

const Character = require('../models/characters')
const Quest = require('../models/quests');
const Room = require('../models/rooms')
const User = require('../models/users')
const { randomNumber } = require('../functions/randomNumber')
const { checkBody } = require('../functions/checkbody')

//Route pour récupérer toutes les quêtes.
router.get('/', async (req, res) => {
    const questData = await Quest.find({});
    if (questData.length > 0) {
        res.json({ result: true, data: questData });
    } else {
        res.json({ result: false, data: 'No data' });
    }
});

//Route GET pour les 3 quêtes aléatoires du menu de choix de quête
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

//Route GET pour récupérer une quête avec son Id
router.get('/getById/:questId', async (req, res) => {

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

//Route d'ajout de quête au personnage
router.post('/newQuest', async (req, res) => {
    try {
        if (!checkBody(req.body, ['characterId', 'questId'])) {
            res.json({ result: false, data: 'Checkbody returned false' })
            return;
        }
        const characterUpdate = await Character.updateOne(
            { _id: req.body.characterId },
            { quest: req.body.questId }
        )

        res.json({ result: true, data: characterUpdate })

    } catch (error) {
        res.json({ result: false, data: error })
    }
});

//Route DELETE enlève la quête en cours du personnage
router.delete('/stopQuest', async (req, res) => {
    try {
        if (!checkBody(req.body, ['characterId'])) {
            res.json({ result: false, data: 'Checkbody returned false' })
            return;
        }
        await Character.updateOne(
            { _id: req.body.characterId },
            { quest: null }
        )

        res.json({ result: true, data: 'Quest deleted' })

    } catch (error) {
        res.json({ result: false, data: error })
    }
});

//Route pour trouver les quêtes lancées par les joueurs. INUTILE ON VA LES CHERCHER AVEC LES ROOMS
// router.get('/joinQuest', async (req, res) => {
//     try {
//         const characterData = await Character.find({
//             quest: { $ne: null }
//         })

//         const questList = []
//         characterData.map((data) => {
//             questList.push({ creator: data.name, questId: data.quest })
//         })

//         res.json({ result: true, data: questList })

//     } catch (error) {
//         res.json({ result: false, data: error })
//     }
// });

//Creation d'une nouvelle room pour récupérer les informations des utilisateurs
router.post('/addRoom', async (req, res) => {
    try {

        if (!checkBody(req.body, ['token', 'questId'])) {
            res.json({ result: false, data: 'Checkbody returned false' })
            return;
        }

        const userData = await User.findOne({ token: req.body.token });

        if (!userData) {
            res.json({ result: false, data: 'No user found' });
            return;
        }

        const isRoomExist = await Room.findOne({ creator: userData._id });

        if (isRoomExist) {
            res.json({ result: false, data: 'user already have quest', intel: isRoomExist });
            return;
        };

        const newRoom = await new Room({
            messages: [],
            creator: userData._id,
            users: [userData._id],
            quest: req.body.questId,
            messages: []
        })

        const roomData = await newRoom.save();

        res.json({ result: true, data: roomData._id })

    } catch (error) {
        res.json({ result: false, data: error })
    }
})

//route get pour récupérer les rooms et les afficher toutes dans le menu multijoueur
router.get('/rooms', async (req, res) => {
    try {

        const roomData = await Room.find().populate('quest').populate('creator');

        const resultData = []

        roomData.map((e) => {
            resultData.push(
                {
                    roomId: e._id,
                    _id: e.quest._id,
                    name: e.quest.name,
                    money: e.quest.money,
                    XP: e.quest.XP,
                    difficulty: e.quest.difficulty,
                    creator: e.creator.username
                }
            )
        })

        res.json({ result: true, data: resultData })

    } catch (error) {
        res.json({ result: false, data: error.message })
    }
})

//Rejoindre la room d'un autre utilisateur
router.post('/room/:roomId/joinRoom', async (req, res) => {

})

//Récupérer tous les messages d'une room
router.get('/room/:roomId/getMessages', async (req, res) => {
    try {

        const roomData = await Room.findById(req.params.roomId)
            .populate({ path: 'messages.user', select: 'username' })

        const data = [];
        await roomData.messages.map((e) => {
            data.push({ user: e.user.username, content: e.content, date: e.date })
        })

        res.json({ result: true, data: data })

    } catch (error) {
        res.json({ result: false, data: error })
    }
})

//Ajout d'un message à la room
router.post('/room/:roomId/addMessage', async (req, res) => {

    try {
        if (!checkBody(req.body, ['token', 'content'])) {
            res.json({ result: false, data: 'Checkbody returned false' })
        }

        const userData = await User.findOne({ token: req.body.token });

        await Room.updateOne(
            { _id: req.params.roomId },
            {
                $push: {
                    messages: {
                        user: userData._id,
                        content: req.body.content,
                        date: new Date()
                    }
                }
            }
        )

        const messagerie = await Room.findById(req.params.roomId).populate(
            {
                path: 'messages.user',
                select: 'username'
            }
        )

        const data = []
        await messagerie.messages.map((e) => {
            data.push({ username: e.user.username, content: e.content, date: e.date })
        })

        //AJOUTER MOMENT SI ON VEUT MANIPULER ET AFFICHER LA DATE DU MESSAGE

        res.json({ result: true, data })

    } catch (error) {
        res.json({ result: false, data: error })
    }

})

//Un utilisateur quitte la quête
router.delete('/room/:roomId/leaveRoom', async (req, res) => {

    try {

        if (!checkBody(req.body, ['token'])) {
            res.json({ result: false, data: 'no data found' });
            return;
        }

        const userData = await User.findOne({ token: req.body.token });

        if (!userData) {
            res.json({ result: false, data: 'Room does not exist' });
        }

        await Room.updateOne(
            { _id: req.params.roomId }, //on trouve la room avec son Id
            { $pull: { users: userData._id } } //On retire le user de la room
        )

        const roomData = await Room.findOne({ _id: req.params.roomId }); //On récupère la room

        if (roomData.users.length === 0) {
            const deletedRoom = await Room.deleteOne({ _id: req.params.roomId });

            res.json({ result: true, deletedRoom, data: 'Room has been deleted' });
            return;
        }

        res.json({ result: true, data: `${userData.username} just leaved the Room` });

    } catch (error) {
        res.json({ result: false, data: error })
    }
})

//Récupérer les utilisateurs de la room pour affichage
router.get('/room/:roomId/getUsers', async (req, res) => {
    try {
        const roomData = await Room.findById(req.params.roomId).populate('users')

        if (roomData === null || roomData === undefined) {
            res.json({ result: false, data: 'no data found' });
            return;
        }

        const data = [];
        roomData.users.map((e) => data.push(e.username))

        res.json({ result: true, data: data })

    } catch (error) {
        res.json({ result: false, data: error })
    }
})

module.exports = router;
