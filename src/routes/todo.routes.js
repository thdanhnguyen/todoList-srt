const routes = require('express').Router();
const todoController = require('../controllers/todo.controllers.js');
const {validateTaskInput} = require('../middlewares/validateTodo.js');

routes.post('/', validateTaskInput, todoController.createTask);
routes.put('/:id', validateTaskInput, todoController.updateTask);

module.exports = routes;