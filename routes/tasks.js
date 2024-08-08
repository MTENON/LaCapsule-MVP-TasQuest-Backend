const express = require("express");
var router = express.Router();

const Task = require("../models/tasks");
const User = require("../models/users");
const Character = require("../models/characters");

const { checkBody } = require("../functions/checkbody");

//Route créer une nouvelle tache
router.post("/new", (req, res) => {
    //Paramètres obbligatoires
    if (!checkBody(req.body, ["name", "difficulty", "token"])) {
        res.json({ result: false, message: "Un champ est manquant" });
        return;
    }
    const { name, description, tags, difficulty, endDate, isUrgent, _id } =
        req.body;

    //Recherche si la tache existe déjà
    Task.findOne({
        creator: _id,
        name: { $regex: new RegExp(name, "i") },
    })
        .then((data) => {
            //Création de la nouvelle tache si la tache non trouvée
            if (!data) {
                const newTask = new Task({
                    type: "Task",
                    creator: _id,
                    name,
                    difficulty,
                    endDate,
                    isUrgent,
                    description,
                    tags,
                });

                //Enregistrement de la nouvelle tache
                newTask
                    .save()
                    .then((newDoc) => {
                        res.json({ result: true, task: newDoc });
                    })
                    .catch((error) => {
                        res.json({
                            result: false,
                            message: "Erreur lors de la sauvegarde",
                            error: error.message,
                        });
                    });
            } else {
                res.json({ result: false, message: "La tache existe" });
            }
        })
        .catch((error) => {
            res.status(500).json({
                result: false,
                message: "Erreur serveur",
                error: error.message,
            });
        });
});

//Récupération de toutes les taches en fonction de l'utilisateur
router.get("/", (req, res) => {
    const { _id } = req.body;
    Task.find({ type: "Task", creator: _id })
        .then((data) => {
            //Aucune tache enregistrée pour l'utilisateur
            if (data.length < 1) {
                res.json({ result: true, message: "Aucune tache est créé" });
            } else {
                res.json({ result: true, data });
            }
        })
        .catch((error) => {
            res.json({
                result: false,
                message: "Erreur serveur",
                error: error.message,
            });
        });
});

//Route pour modifier l'état compléter d'une la tache(en params de l'url)
router.put("/isdone/:_id", async (req, res) => {
    try {
        const { _id: userId } = req.body;
        const { _id: idTask } = req.params;

        // Utilisation de await pour attendre la résolution de la promesse de Task.findOne
        const task = await Task.findOne({
            creator: userId,
            _id: idTask,
        });
        // Si la tâche n'est pas trouvée
        if (!task) {
            console.log("Tâche non trouvée");
            res.status.json({ result: false, error: "Tâche non trouvée" });
            return;
        }

        // Déterminer la nouvelle valeur de isDone
        const newIsDone = !task.isDone;

        // Construire l'objet de mise à jour pour la tâche
        const updateTask = { $set: { isDone: newIsDone } };

        // Points et pièces selon la difficulté
        //en test 1 point par difficulté en HP et en argent
        const pointsAndCoins = task.difficulty;

        // Utilisation de await pour attendre la mise à jour de la tâche
        await Task.updateOne({ creator: userId, _id: idTask }, updateTask);

        // Utilisation de await pour attendre la résolution de la promesse de Character.findOne
        const character = await Character.findOne({ user: userId });
        if (!character) {
            console.log("Personnage non trouvé");
            res.status.json({
                result: false,
                error: "Personnage non trouvé",
            });
            return;
        }

        // MAJ pour les caractéristiques du personnage
        const characterUpdate = {
            $inc: {
                "caracteristics.XP": newIsDone
                    ? pointsAndCoins
                    : -pointsAndCoins,
                money: newIsDone ? pointsAndCoins : -pointsAndCoins,
            },
        };

        // Utilisation de await pour attendre la résolution de la promesse de Character.findOne
        await Character.updateOne({ _id: character._id }, characterUpdate);
        res.json({ result: true });
    } catch (err) {
        console.error(err);
        res.json({ result: false, error: err.message });
    }
});

router.put("/update/:_id", async (req, res) => {
    try {
        const {
            _id: userId,
            name,
            difficulty,
            tags,
            isUrgent,
            description,
            endDate,
        } = req.body;

        const { _id: idTask } = req.params;

        const task = await Task.findOne({
            creator: userId,
            type: "Task",
            _id: idTask,
        });

        if (!task) {
            res.json({
                result: false,
                error: "Tâche non trouvée",
            });
            return;
        }

        //Création de l'objet pour la MAJ de la tache
        const updateTask = {
            name,
            difficulty,
            tags,
            isUrgent,
            description,
            updatedAt: new Date(),
            endDate,
        };
        await Task.updateOne({ _id: idTask }, { $set: updateTask });

        res.json({ result: true, message: "Tâche mise à jour avec succès" });
    } catch (err) {
        console.error(err);
        res.json({ result: false, error: err.message });
    }
});

//Passer la tache en en favorite
router.put("/isfavorite/:_id", async (req, res) => {
    try {
        const { _id: userId } = req.body;
        const { _id: idTask } = req.params;

        const task = await Task.findOne({
            creator: userId,
            type: "Task",
            _id: idTask,
        });

        if (!task) {
            res.json({
                result: false,
                error: "Tâche non trouvée",
            });
            return;
        }
        const newIsFavorite = !task.isFavorite;

        await Task.updateOne(
            { _id: idTask },
            { $set: { isFavorite: newIsFavorite } }
        );

        res.json({
            result: true,
            message: "Tâche mise à jour avec succès",
            isFavorite: newIsFavorite,
        });
    } catch (err) {
        console.error(err);
        res.json({ result: false, error: err.message });
    }
});

//Mettre une nouvelle tache
router.post("/newtodo/:_id", async (req, res) => {
    try {
        const { userId, toDo } = req.body;
        const { _id } = req.params;

        const task = await Task.findOne({
            creator: userId,
            _id,
        });

        if (!task) {
            return res.json({
                result: false,
                error: "Tâche non trouvée",
            });
        }

        const newToDo = {
            toDo,
            todoIsCompleted: false,
        };

        task.insideToDos.push(newToDo);

        await task.save();

        res.json({ result: true, task });
    } catch (err) {
        console.error(err);
        res.json({ result: false, error: err.message });
    }
});

// Mettre à jour une Todo
router.put("/updatetodo/:taskId/:todoId", async (req, res) => {
    try {
        const { userId, toDo } = req.body;
        const { taskId, todoId } = req.params;

        // Vérifiez si l'utilisateur a les droits sur la tâche
        const task = await Task.findOne({
            creator: userId,
            _id: taskId,
        });

        if (!task) {
            return res.json({
                result: false,
                error: "Tâche non trouvée",
            });
        }

        // Mettez à jour la Todo spécifique à l'intérieur de la tâche principale
        const result = await Task.findOneAndUpdate(
            { _id: taskId, creator: userId, "insideToDos._id": todoId },
            {
                $set: {
                    "insideToDos.$.toDo": toDo,
                },
            },
            { new: true }
        );

        if (!result) {
            return res.json({
                result: false,
                error: "Todo non trouvée ou non modifiée",
            });
        }

        res.json({
            result: true,
            message: "Todo mise à jour avec succès",
            task: result,
        });
    } catch (err) {
        console.error(err);
        res.json({ result: false, error: err.message });
    }
});

router.post("/completetodo/:taskId/:todoId", async (req, res) => {
    try {
        const { userId } = req.body;
        const { taskId, todoId } = req.params;

        const task = await Task.findOne({
            creator: userId,
            _id: taskId,
        });

        if (!task) {
            return res.json({
                result: false,
                error: "Tâche non trouvée",
            });
        }

        // Trouver la Todo
        const todo = task.insideToDos.id(todoId);

        if (!todo) {
            return res.json({
                result: false,
                error: "Todo non trouvée",
            });
        }

        // Inverser la valeur de todoIsCompleted
        const newTodoIsCompleted = !todo.todoIsCompleted;

        // MAJ de la todo
        const result = await Task.findOneAndUpdate(
            { _id: taskId, creator: userId, "insideToDos._id": todoId },
            {
                $set: {
                    "insideToDos.$.todoIsCompleted": newTodoIsCompleted,
                },
            },
            { new: true }
        );

        if (!result) {
            return res.json({
                result: false,
                error: "Todo non trouvée ou non modifiée",
            });
        }

        res.json({
            result: true,
            message: "Todo mise à jour avec succès",
            task: result,
        });
    } catch (err) {
        res.json({ result: false, error: err.message });
    }
});

// Supprimer une Todo
router.delete("/deletetodo/:taskId/:todoId", async (req, res) => {
    try {
        const { userId } = req.body;
        const { taskId, todoId } = req.params;

        const task = await Task.findOne({
            creator: userId,
            _id: taskId,
        });

        if (!task) {
            return res.json({
                result: false,
                error: "Tâche non trouvée",
            });
        }

        // Utilisez findOneAndUpdate avec $pull pour supprimer la Todo spécifique
        const result = await Task.findOneAndUpdate(
            { _id: taskId, creator: userId },
            { $pull: { insideToDos: { _id: todoId } } },
            { new: true }
        );

        if (!result) {
            return res.json({
                result: false,
                error: "Todo non trouvée ou non supprimée",
            });
        }

        res.json({
            result: true,
            message: "Todo supprimée avec succès",
            task: result,
        });
    } catch (err) {
        console.error(err);
        res.json({ result: false, error: err.message });
    }
});
module.exports = router;
