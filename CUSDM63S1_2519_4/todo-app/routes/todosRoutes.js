const express = require('express');
const router = express.Router();
const todosController = require('../controllers/todosController');

router.get('/', todosController.getAllTodos);
router.post('/', todosController.createTodo);
router.get('/:id', todosController.getTodoById);
router.put('/:id', todosController.updateTodo);
router.delete('/:id', todosController.deleteTodo);
router.get('/search', todosController.searchTodos);

module.exports = router;