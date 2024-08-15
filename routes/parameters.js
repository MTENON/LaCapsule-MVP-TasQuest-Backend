var express = require("express");
var router = express.Router();

//Dépendances
const bcrypt = require('bcrypt')

//Fonctions
const { checkBody } = require("../functions/checkbody")

//Models
const User = require("../models/users");
const Character = require("../models/characters")

router.post('/userMail', async (req, res) => {
    try {
        if (!checkBody(req.body, ["token"])) {
            res.json({ result: false, data: 'Checkbody returned false' })
        }
        const userData = await User.findOne({ token: req.body.token });

        res.json({ result: true, data: userData.email })

    } catch (error) {
        res.json({ result: false, error: error.message })
    }
})

router.put('/username', async (req, res) => {
    try {
        if (!checkBody(req.body, ["token", "newUsername", "password"])) {
            res.json({ result: false, data: "checkbody returned false" })
            return;
        }

        const userAlreadyExist = await User.findOne({ username: req.body.newUsername });

        if (userAlreadyExist) {
            res.json({ result: false, data: "Username already exist" })
        }

        const userData = await User.findOne({ token: req.body.token });
        // res.json({ result: bcrypt.compareSync(req.body.password, userData.password) })
        if (!userData) {
            res.json({ result: false, data: 'No user in database' })
            return;
        } else if (userData && !bcrypt.compareSync(req.body.password, userData.password)) {
            res.json({ result: false, error: 'wrong password' })
            return;
        } else if (userData && bcrypt.compareSync(req.body.password, userData.password)) {

            await User.updateOne(
                { token: req.body.token },
                { username: req.body.newUsername }
            )

            res.json({ result: true, data: "Username changed" })
        }

    } catch (error) {
        res.json({ result: false, error: error.message })
        return;
    }
})

router.put('/password', async (req, res) => {
    try {
        if (!checkBody(req.body, ["token", "newPassword", "password"])) {
            res.json({ result: false, data: "checkbody returned false" })
            return;
        }

        const userData = await User.findOne({ token: req.body.token });

        if (!userData) {
            res.json({ result: false, data: 'No user in database' })
            return;
        } else if (userData && !bcrypt.compareSync(req.body.password, userData.password)) {
            res.json({ result: false, error: 'wrong password' })
            return;
        } else if (userData && bcrypt.compareSync(req.body.password, userData.password)) {

            await User.updateOne(
                { token: req.body.token },
                { password: bcrypt.hashSync(req.body.newPassword, 10) }
            )

            res.json({ result: true, data: "Password changed" })
        }

    } catch (error) {
        res.json({ result: false, error: error.message })
    }
})

router.put('/email', async (req, res) => {
    try {
        if (!checkBody(req.body, ["token", "newEmail", "password"])) {
            res.json({ result: false, data: "checkbody returned false" })
            return;
        }

        const userData = await User.findOne({ token: req.body.token });

        if (!userData) {
            res.json({ result: false, data: 'No user in database' })
            return;
        } else if (userData && !bcrypt.compareSync(req.body.password, userData.password)) {
            res.json({ result: false, error: 'wrong password' })
            return;
        } else if (userData && bcrypt.compareSync(req.body.password, userData.password)) {

            await User.updateOne(
                { token: req.body.token },
                { email: req.body.newEmail }
            )

            res.json({ result: true, data: "Email changed" })
        }

    } catch (error) {
        res.json({ result: false, error: error.message })
    }
})


router.put('/characterName', async (req, res) => {
    try {
        if (!checkBody(req.body, ["token", "newCharacterName", "password"])) {
            res.json({ result: false, data: "checkbody returned false" })
            return;
        }

        const userData = await User.findOne({ token: req.body.token });

        if (!userData) {
            res.json({ result: false, data: 'No user in database' })
            return;
        } else if (userData && !bcrypt.compareSync(req.body.password, userData.password)) {
            res.json({ result: false, error: 'wrong password' })
            return;
        } else if (userData && bcrypt.compareSync(req.body.password, userData.password)) {

            await Character.updateOne(
                { user: userData._id },
                { name: req.body.newCharacterName }
            )

            res.json({ result: true, data: "Character name changed" })
        }

    } catch (error) {
        res.json({ result: false, error: error.message })
    }
})

router.delete('/eraseAccount', async (req, res) => {
    try {
        if (!checkBody(req.body, ["token", "password", "confirmPassword"])) {
            res.json({ result: false, data: "checkbody returned false" })
            return;
        }

        const userData = await User.findOne({ token: req.body.token });

        if (req.body.password !== req.body.confirmPassword || !userData) {
            res.json({ result: false, data: "No user found" })
            return;
        }

        if (!bcrypt.compareSync(req.body.password, userData.password)) {
            res.json({ result: false, data: "Mot de passe erronée." })
            return;
        }

        await Character.deleteOne({ user: userData._id })
        await User.deleteOne({ token: req.body.token })

        res.json({ result: true, data: "Votre compte à été supprimé." })
        return;

    } catch (error) {
        res.json({ result: false, error: error.message })
        return;
    }
})


module.exports = router;