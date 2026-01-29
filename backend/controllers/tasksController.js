const Task = require("../model/modelTask");


//on va creer les fonctions pour chaque route

//recup toutes les taches
exports.getAllTasks = async (req, res) => {
    try {
        const filter = {};
        
        if (req.query.statut) {
            filter.statut = req.query.statut;
        }        
        if (req.query.priorite) {
            filter.priorite = req.query.priorite;
        }      
        if (req.query.categorie) {
            filter.categorie = req.query.categorie;
        }  
        if (req.query.etiquette) {
            filter.etiquettes = req.query.etiquette;
        }      
        if (req.query.avant || req.query.apres) {
            filter.echeance = {};
            
            if (req.query.avant) {
                filter.echeance.$lte = new Date(req.query.avant);
            }            
            if (req.query.apres) {
                filter.echeance.$gte = new Date(req.query.apres);
            }
        }
        if (req.query.q) {
            filter.$or = [
                { titre: { $regex: req.query.q, $options: 'i' } },
                { description: { $regex: req.query.q, $options: 'i' } }
            ];
        }
        let sortOption = {};
        const triPar = req.query.tri || 'dateCreation';
        const ordre = req.query.ordre === 'asc' ? 1 : -1;     
        sortOption[triPar] = ordre; 
        const tasks = await Task.find(filter).sort(sortOption);       
        res.json(tasks);      
    } catch (error) {
        console.error('ERREUR:', error);
        res.status(500).json({ 
            error: 'Erreur serveur',
            details: error.message 
        });
    }
};

//recup tache par son id
exports.getTaskById = async (req, res) => {
    const task = await Task.findById(req.params.id);
    res.json(task);
};

exports.updateTask = async (req, res) => {
    const editTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(editTask);
};

exports.deleteTask = async (req, res) => {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: "tache supprimée" });
};


exports.createTask = async (req, res) => {
    const newTask = new Task(req.body);
    await newTask.save();
    res.json(newTask);
};


exports.addComment = async (req, res) => {
    const task = await Task.findById(req.params.id);
    if (!task) {
        return res.status(404).json({ message: "Pas de tache trouvee" });
    }
    task.commentaires.push(req.body);
    await task.save();
    res.json(task);
};

exports.addSousTache = async (req, res) => {
    const task = await Task.findById(req.params.id);
    if (!task) {
        return res.status(404).json({ message: "Pas de tache trouvee" });
    }
    task.sousTaches.push(req.body);
    await task.save();
    res.json(task);
};












