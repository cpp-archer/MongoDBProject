const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const Task = require ("./model/modelTask");

const app = express();
const PORT = 5555;

mongoose.connect("mongodb://localhost:27017/BDDrj");


app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname, "front"))); //pour html css js 

//////////////FRONT///////////////////////
//accueil
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname,"front", "/accueil.html"));
});

//liste des taches
app.get("/TasksList", (req, res) => {
    res.sendFile(path.join(__dirname,"front", "/TasksList.html"));
});

//page pour creer une tache
app.get("/createTask", (req, res) => {
    res.sendFile(path.join(__dirname, "front", "/createTask.html"));
});

//info d'une tache
app.get("/taskInfo/:id", (req, res) => {
    res.sendFile(path.join(__dirname, "front", "/taskInfo.html"));
});

//////////////BACK API///////////////////////////
/////GET/////

//on recupere TOUTES les taches
app.get("/api/tasks", async (req, res) => {
    const tasks = await Task.find();
    res.json(tasks);
});

//recuperer une tahce par son id
app.get("/api/tasks/:id", async (req, res) => {
    const task = await Task.findById(req.params.id);
    res.json(task);
});




///////////////MODIFICATIONS//////////////

//put mettre a jour une tache
app.put("/api/tasks/:id", async (req, res) => {
    const editTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(editTask);
});

//supp une tache
app.delete("/api/tasks/:id", async (req, res) => {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: "tache supprimée" });
});
//const Task = require("./model/modelTask");



///////////////////////POST////////////////////////////

//post creer une nouvelle tache
app.post("/api/tasks", async (req, res) => {
    const newTask = new Task(req.body);
    await newTask.save();
    res.json(newTask);
});

//ajouter un commentaire à une tache
app.post("/api/tasks/:id/commentaires", async (req, res) => {
    const task = await Task.findById(req.params.id);
    if (!task) {
        return res.status(404).json({ message: "Pas de tache trouvee" });
    }
    task.commentaires.push(req.body);
    await task.save();
    res.json(task);
});


//ajuooter une sous-tache à une tache
app.post("/api/tasks/:id/sous-taches", async (req, res) => {
    const task = await Task.findById(req.params.id);
    if (!task) {
        return res.status(404).json({ message: "Pas de tache trouvee" });
    }
    task.sousTaches.push(req.body);
    await task.save();
    res.json(task);
});


//classique 
app.listen(PORT, ()=>{
    console.log(`ok sur le port ${PORT}`);
})
