const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const Task = require("./model/modelTask");

const app = express();
const PORT = 5555;

// Connexion MongoDB
mongoose.connect("mongodb://localhost:27017/BDDrj");

// Middlewares
app.use(cors()); // IMPORTANT : permet au frontend (port 3000) d'accéder à l'API
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ========================================
// API - LECTURE (GET)
// ========================================

// GET toutes les tâches (avec filtres et tri)
app.get("/api/tasks", async (req, res) => {
    try {
        const filter = {};
        
        // Filtres
        if (req.query.statut) filter.statut = req.query.statut;
        if (req.query.priorite) filter.priorite = req.query.priorite;
        if (req.query.categorie) filter.categorie = req.query.categorie;
        
        // Recherche textuelle
        if (req.query.q) {
            filter.$or = [
                { titre: new RegExp(req.query.q, 'i') },
                { description: new RegExp(req.query.q, 'i') }
            ];
        }
        
        // Filtre par date
        if (req.query.avant) {
            filter.echeance = { $lte: new Date(req.query.avant) };
        }
        if (req.query.apres) {
            filter.dateCreation = { $gte: new Date(req.query.apres) };
        }
        
        // Tri
        let sort = {};
        if (req.query.tri) {
            const ordre = req.query.ordre === 'asc' ? 1 : -1;
            sort[req.query.tri] = ordre;
        } else {
            sort.dateCreation = -1; // Par défaut : plus récent d'abord
        }
        
        const tasks = await Task.find(filter).sort(sort);
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
});

// GET une tâche par ID
app.get("/api/tasks/:id", async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ message: "Tâche non trouvée" });
        }
        res.json(task);
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
});

// ========================================
// API - CRÉATION (POST)
// ========================================

// POST créer une nouvelle tâche
app.post("/api/tasks", async (req, res) => {
    try {
        const newTask = new Task(req.body);
        await newTask.save();
        res.status(201).json(newTask);
    } catch (error) {
        res.status(500).json({ message: "Erreur création", error: error.message });
    }
});

// POST ajouter un commentaire
app.post("/api/tasks/:id/commentaires", async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ message: "Tâche non trouvée" });
        }
        task.commentaires.push(req.body);
        await task.save();
        res.json(task);
    } catch (error) {
        res.status(500).json({ message: "Erreur ajout commentaire", error: error.message });
    }
});

// POST ajouter une sous-tâche
app.post("/api/tasks/:id/sous-taches", async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ message: "Tâche non trouvée" });
        }
        task.sousTaches.push(req.body);
        await task.save();
        res.json(task);
    } catch (error) {
        res.status(500).json({ message: "Erreur ajout sous-tâche", error: error.message });
    }
});

// ========================================
// API - MODIFICATION (PUT/DELETE)
// ========================================

// PUT mettre à jour une tâche
app.put("/api/tasks/:id", async (req, res) => {
    try {
        const editTask = await Task.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true }
        );
        if (!editTask) {
            return res.status(404).json({ message: "Tâche non trouvée" });
        }
        res.json(editTask);
    } catch (error) {
        res.status(500).json({ message: "Erreur mise à jour", error: error.message });
    }
});

// DELETE supprimer une tâche
app.delete("/api/tasks/:id", async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);
        if (!task) {
            return res.status(404).json({ message: "Tâche non trouvée" });
        }
        res.json({ message: "Tâche supprimée avec succès" });
    } catch (error) {
        res.status(500).json({ message: "Erreur suppression", error: error.message });
    }
});

// Démarrage du serveur
app.listen(PORT, () => {
    console.log(`🚀 API Backend démarrée sur http://localhost:${PORT}`);
});