const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const taskController = require("../controllers/taskController");
const taskValidator = require("../utils/validators/taskValidator");
const { setAccountId, filterAccountResults } = require("../utils/requestUtils");

router.use(authController.protect, taskController.checkTasksPermission);

router
  .route("/")
  .get(filterAccountResults, taskController.getAllTasks)
  .post(
    authController.checkPermission("ADD_TASK"),
    taskValidator.createTaskValidator,
    setAccountId,
    taskController.createTask
  );

router
  .route("/:id")
  .get(taskValidator.getTaskValidator, taskController.getTask)
  .patch(
    authController.checkPermission("UPDATE_TASK"),
    taskValidator.updateTaskValidator,
    taskController.updateTask
  )
  .delete(
    authController.checkPermission("DELETE_TASK"),
    taskValidator.getTaskValidator,
    taskController.deleteTask
  );

router.patch(
  "/:id/complete",
  authController.checkPermission("COMPLETE_TASK"),
  taskValidator.completeTaskValidator,
  taskController.completeTask
);

module.exports = router;
