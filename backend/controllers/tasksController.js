const Task = require("../model/modelTask");


//on va creer les fonctions pour chaque route

//recup toutes les taches
exports.getAllTasks = async (req, res) => {
    const tasks = await Task.find();
    res.json(tasks);
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