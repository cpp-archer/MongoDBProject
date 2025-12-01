const express = require("express");
const mongoose = require("mongoose");
const app = express();
const PORT = 5555;

mongoose.connect("mongodb://localhost:27017/BDDrj");
// app.use(express.urlencoded({extended:true}));
// app.use(express.jscon());


// app.get("/", async (req, res)=> {

// // res.redirect("/accueil");
// // });

const path = require("path");


app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "/accueil.html"));
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


