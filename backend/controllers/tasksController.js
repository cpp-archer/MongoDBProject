const Task = require("../model/modelTask"); //on récup le model


exports.getAllTask =async (req, res) => {
    try {


        const filter = {};
        
        // Filtres
        if (req.query.statut) filter.statut = req.query.statut;
        if (req.query.priorite) filter.priorite = req.query.priorite;
        if (req.query.categorie) filter.categorie = req.query.categorie;
        
        // Recherche textuelle
        if (req.query.q) {
            filter.$or = [
                { titre: new RegExp(req.query.q, 'i') },
                { description: new RegExp(req.query.q, 'i') }
            ];
        }
        
        // Filtre par date
        if (req.query.avant) {
            filter.echeance = { $lte: new Date(req.query.avant) };
        }
        if (req.query.apres) {
            filter.dateCreation = { $gte: new Date(req.query.apres) };
        }
        
        // Tri
        let sort = {};
        if (req.query.tri) {
            const ordre = req.query.ordre === 'asc' ? 1 : -1;
            sort[req.query.tri] = ordre;
        } else {
            sort.dateCreation = -1; // Par défaut : plus récent d'abord
        }
        
        const tasks = await Task.find(filter).sort(sort);
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error: error.message });
    }
});
