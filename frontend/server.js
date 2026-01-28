const express = require("express");
const path = require("path");

const app = express();
const PORT = 3001;

// Servir les fichiers statiques
app.use(express.static(path.join(__dirname, "public")));

// Routes HTML
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "accueil.html"));
});

app.get("/TasksList", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "TasksList.html"));
});

app.get("/createTask", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "createTask.html"));
});

app.get("/taskInfo/:id", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "taskInfo.html"));
});

// Démarrage serveur
app.listen(PORT, () => {
    console.log(`🌐 Frontend démarré sur http://localhost:${PORT}`);
});