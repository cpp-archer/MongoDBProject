const express = require("express");
const mongoose = require("mongoose");
const app = express();
const PORT = 5555;

mongoose.connect("mongodb://localhost:27017/bibliotheque");
// app.use(express.urlencoded({extended:true}));
// app.use(express.jscon());


app.get("/", async (req, res)=> {

res.redirect("/accueil");
});


app.listen(PORT, ()=>{
    console.log(`ok sur le port ${PORT}`);
})

const Film = mongoose.model("films",{
    titre:String,
    annee:Number,
    genre:String
});
Film.find().then(console.log);


