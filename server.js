const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const Task = require ("./models/Task");

const app = express();
const PORT = 5555;

mongoose.connect("mongodb://localhost:27017/BDDrj");


app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname, "public"))); //pour html css js 


//accueil
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname,"public", "/accueil.html"));
});

//liste des taches
app.get("/TasksList", (req, res) => {
    res.sendFile(path.join(__dirname,"public", "/TasksList.html"));
});

//page pour creer une tache
app.get("/createTask", (req, res) => {
    res.sendFile(path.join(__dirname,"public", "/createTask.html"));
});

//info d'une tache
app.get("/taskInfo/:id", (req, res) => {
    res.sendFile(path.join(__dirname,"public", "/taskInfo.html"));
});

app.listen(PORT, ()=>{
    console.log(`ok sur le port ${PORT}`);
})

const Film = mongoose.model("taches",{
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
Film.find().then(console.log);


