const express = require("express");
const mongoose = require("mongoose");
const app = express();
const path = require("path");
const { create } = require("hbs");
const PORT = 5555;

mongoose.connect("mongodb://localhost:27017/BDDrj");

//Configuration du moteur de template
app.set("view engine", "hbs"); 
app.set("views", path.join(__dirname, "views"));

//gestion des formulaires
app.use(express.urlencoded({extended:true}));
app.use(express.json());



//get toutes les taches
app.get("/tasks", async (req, res) => {
   
    res.render("taches/listTask", {tasks}); //renvoie le hbs de toutes les taches
});


// app.post("/task", async (req, res) => {
//     const newTask = new task({


// app.get("/", (req, res) => {
//     res.sendFile(path.join(__dirname, "/accueil.html"));
// });

    //res.sendFile(path.join(__dirname, "/accueil.html"));
//app.post(/task)





app.get("/tasks", (req, res) => {
    res.sendFile(path.join(__dirname, "/tasks.html"));
}); 

app.get("/task/:id", (req, res) => {
    res.sendFile(path.join(__dirname, "/task.html"));
});
// res.render("Genres/index", {genres}); 

//creer une tache 
app.get("/createTask", (req, res) => {
    res.sendFile(path.join(__dirname, "/createTask.html"));
});




const task = mongoose.model("taches",{
    titre:String,
    description:String,
    dateCreation:Date,
    echeance:Date,
    statut:String,
    priorite:String,
    auteur: { String},
    categorie: String,
    etiquettes: [ String],
    'sous-taches': [Object],
    commentaires: [ Object ],
    historiqueModifications: [ Object ]
});

task.find().then(console.log);


app.listen(PORT, ()=>{
    console.log(`ok sur le port ${PORT}`);
});
