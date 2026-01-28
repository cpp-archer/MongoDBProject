const express = require("express");
const mongoose = require("mongoose");

const path = require("path");


const tasksRoutes = require("./routes/tasksRoute");

const app = express();
const PORT = 5555;  

//connexion à MongoDB 
mongoose.connect("mongodb://localhost:27017/BDDrj");

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use(express.static(path.join(__dirname, "front"))); //pour html css js

//accueil
app.get("/", (req, res) => {
    res.json({ message: "api good " });
});

//on recup les routes API
app.use("/api/tasks", tasksRoutes); 

app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3001",
  credentials: true
}));

app.listen(PORT, () => {
    console.log(`ça marche sur le port ${PORT}`);
});