const routes = require('express').Router();
const todoController = require('../controllers/todo.controllers.js');
const {validateTaskInput} = require('../middlewares/validateTodo.js');

routes.post('/', validateTaskInput, todoController.createTask);
routes.put('/:id', validateTaskInput, todoController.updateTask);
routes.put('/:id/status', todoController.updateTaskStatus);
routes.delete('/:id', todoController.deleteTask);
routes.get('/', todoController.getAllTask);
routes.get('/:id', todoController.getTaskById);

module.exports = routes;