const Todo = require('../models/Todo');

exports.getAllTodos = (req, res) => {
  try {
    const todos = Todo.findAll();
    res.status(200).json(todos);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch todos' });
  }
};

exports.createTodo = (req, res) => {
  try {
    if (!req.body.title) {
      return res.status(400).json({ error: 'Title is required' });
    }
    const todo = Todo.create(req.body);
    res.status(201).json(todo);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create todo' });
  }
};

exports.getTodoById = (req, res) => {
  try {
    const todo = Todo.findById(parseInt(req.params.id));
    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    res.status(200).json(todo);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch todo' });
  }
};

exports.updateTodo = (req, res) => {
  try {
    const updatedTodo = Todo.update(parseInt(req.params.id), req.body);
    if (!updatedTodo) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    res.status(200).json(updatedTodo);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update todo' });
  }
};

exports.deleteTodo = (req, res) => {
  try {
    const isDeleted = Todo.delete(parseInt(req.params.id));
    if (!isDeleted) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    res.status(200).json({ message: 'Todo deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete todo' });
  }
};

exports.searchTodos = (req, res) => {
  try {
    if (!req.query.q) {
      return res.status(400).json({ error: 'Search query is required' });
    }
    const results = Todo.search(req.query.q);
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: 'Failed to search todos' });
  }
};