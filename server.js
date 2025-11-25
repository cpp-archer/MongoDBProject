const express = require("express");
const app = express();
const PORT = 5555;
const path = require("path");
// app.use(express.urlencoded({extended:true}));
// app.use(express.jscon());


// app.get("/", async (req, res)=> {

// res.redirect("/accueil");


// });

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "/accueil.html"));
});


app.listen(PORT, ()=>{
    console.log(`ok sur le port ${PORT}`);
})