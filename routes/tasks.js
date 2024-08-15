const express = require("express");
var router = express.Router();

const Task = require("../models/tasks");
const User = require("../models/users");
const Character = require("../models/characters");

const { checkBody } = require("../functions/checkbody");

//Route créer une nouvelle tache
router.post("/new", (req, res) => {
    // Validation de la présence des champs requis
    if (!checkBody(req.body, ["name", "difficulty", "token"])) {
        return res.json({ result: false, message: "Un champ est manquant" });
    }

    const {
        name,
        description,
        tags,
        startDate,
        difficulty,
        endDate,
        isUrgent,
        _id,
    } = req.body;

    console.log("Creating task for user:", _id);

    // Création de la nouvelle tâche
    const newTask = new Task({
        type: "Task",
        creator: _id,
        name,
        difficulty: 1,
        startDate: startDate ? new Date(startDate) : new Date(),
        endDate: endDate ? new Date(endDate) : null,
        isUrgent: isUrgent || false,
        description: description || "",
        tags: tags || [],
    });

    // Sauvegarde de la nouvelle tâche dans la base de données
    newTask
        .save()
        .then((newDoc) => {
            console.log("Task created:", newDoc);
            res.json({ result: true, task: newDoc });
        })
        .catch((error) => {
            console.error("Save error:", error.message);
            res.status(500).json({
                result: false,
                message: "Erreur lors de la sauvegarde",
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
                console.log(data);

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

router.get("/:_id", (req, res) => {
    const { _id: userId } = req.body;
    const { _id: idTask } = req.params;
    Task.findOne({ _id: idTask, creator: userId })
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
        const updateTask = {
            $set: { isDone: newIsDone, updatedAt: new Date() },
        };

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
                point: pointsAndCoins,
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

router.post("/update/:_id", async (req, res) => {
    try {
        const {
            _id: userId,
            name,
            difficulty,
            tags,
            isUrgent,
            startDate,
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
            startDate,
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
router.post("/todo/:taskId/new", async (req, res) => {
    try {
        const { _id: userId, toDo } = req.body;
        const { taskId } = req.params;

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

        const newToDo = {
            toDo,
            todoIsCompleted: false,
        };

        task.insideToDos.push(newToDo);

        await task.save();

        res.json({ result: true, task });
    } catch (err) {
        res.json({ result: false, error: err.message });
    }
});

router.get("/todo/:taskId", async (req, res) => {
    try {
        const { taskId } = req.params;

        // Recherche de la tâche par son ID
        const task = await Task.findById(taskId);

        // Si la tâche n'existe pas, retourner une réponse vide
        if (!task) {
            return res.json({ result: true, todos: [] });
        }

        // Si la tâche est trouvée, retourner le tableau des ToDos
        res.json({ result: true, todos: task.insideToDos });
    } catch (err) {
        res.json({ result: false, error: err.message });
    }
});

router.post("/todo/:taskId/:todoId", async (req, res) => {
    try {
        const { taskId, todoId } = req.params;
        const userId = req.body._id;

        // Trouver la tâche et le sous-document spécifique
        const task = await Task.findOne({
            _id: taskId,
            creator: userId,
            "insideToDos._id": todoId,
        });

        if (!task) {
            return res.status(404).json({
                result: false,
                error: "Tâche ou Todo non trouvé",
            });
        }

        // Trouver le sous-document à mettre à jour
        const todo = task.insideToDos.id(todoId);
        if (!todo) {
            return res.status(404).json({
                result: false,
                error: "Todo non trouvé",
            });
        }

        // Inverser la valeur de `todoIsCompleted`
        todo.todoIsCompleted = !todo.todoIsCompleted;

        // Sauvegarder la tâche avec le sous-document mis à jour
        await task.save();

        res.json({
            result: true,
            message: "Todo mis à jour avec succès",
            task: task,
        });
    } catch (err) {
        console.error("Erreur lors de la mise à jour du Todo:", err);
        res.status(500).json({
            result: false,
            error: "Erreur serveur interne",
        });
    }
});

// Supprimer une Todo
router.delete("/deletetodo/:taskId/:todoId", async (req, res) => {
    try {
        // Correction ici : on extrait directement `_id` de `req.body` et le renomme en `userId`
        const userId = req.body._id;
        const { taskId, todoId } = req.params;

        console.log("Received userId:", userId);
        console.log("Received taskId:", taskId);
        console.log("Received todoId:", todoId);

        const task = await Task.findOne({
            creator: userId,
            _id: taskId,
        });

        if (!task) {
            console.error(
                "Tâche non trouvée pour userId:",
                userId,
                "et taskId:",
                taskId
            );
            return res.json({
                result: false,
                error: "Tâche non trouvée",
            });
        }

        const result = await Task.updateOne(
            { _id: taskId, creator: userId },
            { $pull: { insideToDos: { _id: todoId } } }
        );

        if (result.nModified === 0) {
            console.error(
                "Todo non trouvée ou non supprimée pour todoId:",
                todoId
            );
            return res.json({
                result: false,
                error: "Todo non trouvée ou non supprimée",
            });
        }

        console.log("Todo successfully deleted:", todoId);

        res.json({
            result: true,
            message: "Todo supprimée avec succès",
        });
    } catch (err) {
        console.error("Erreur lors de la suppression de la todo:", err.message);
        res.json({ result: false, error: err.message });
    }
});

router.delete("/delete/:_id", async (req, res) => {
    try {
        const { _id } = req.params;
        const { _id: userId } = req.body;

        const task = await Task.findOneAndDelete({ _id, creator: userId });

        if (!task) {
            return res.status(404).json({
                result: false,
                error: "Tâche non trouvée",
            });
        }

        res.json({ result: true, message: "Tâche supprimée avec succès" });
    } catch (err) {
        console.error(err);
        res.json({ result: false, error: err.message });
    }
});
module.exports = router;
