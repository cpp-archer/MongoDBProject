const express = require("express");
const app = express();
const PORT = 5555;

// app.use(express.urlencoded({extended:true}));
// app.use(express.jscon());


app.get("/", async (req, res)=> {

res.redirect("/accueil");


});


app.listen(PORT, ()=>{
    console.log(`ok sur le port ${PORT}`);
})