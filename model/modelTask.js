// const mongoose = require("mongoose");

// const Task = mongoose.Schema("taches",{
//     titre:String,
//     description:String,
//     dateCreation:Date,
//     echeance:Date,
//     statut:String,
//     priorite:String,
//     auteur: { String},
//     categorie: String,
//     etiquettes: [ String],
//     'sous-taches': [Object],
//     commentaires: [ Object ],
//     historiqueModifications: [ Object ]
// });

const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
    titre: String,
    description: String,
    dateCreation: {
        type: Date,
        default: Date.now
    },
    echeance: Date,
    statut: String,        
    priorite: String,    

    auteur: {
        nom: String,
        prenom: String,
        email: String
    },

    categorie: String,
    etiquettes: [String],

    sousTaches: [Object],      
    commentaires: [Object],    
    historiqueModifications: [Object]
});

const TaskModel = mongoose.model("Task", TaskSchema);

// Export du modèle (ligne manquante)
module.exports = TaskModel;




