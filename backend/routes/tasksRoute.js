const express = require("express");
const router = express.Router();
//const controller = require("../controllers/tasks.controller");


router.get("/", controller.getAllTasks);
router.get("/:id", controller.getTaskById);
router.post("/", controller.createTask);
router.post("/:id/commentaires", controller.addComment);
router.post("/:id/sous-taches", controller.addSousTache);
router.put("/:id", controller.updateTask);
router.delete("/:id", controller.deleteTask);


module.exports = router;