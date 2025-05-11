const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '../db.json');

class Todo {
  static findAll() {
    const data = fs.readFileSync(DB_PATH);
    return JSON.parse(data).todos;
  }

  static saveAll(todos) {
    fs.writeFileSync(DB_PATH, JSON.stringify({ todos }, null, 2));
  }

  static findById(id) {
    const todos = this.findAll();
    return todos.find(todo => todo.id === id);
  }

  static create(newTodo) {
    const todos = this.findAll();
    const id = todos.length > 0 ? Math.max(...todos.map(t => t.id)) + 1 : 1;
    const todo = { id, ...newTodo };
    todos.push(todo);
    this.saveAll(todos);
    return todo;
  }

  static update(id, updatedTodo) {
    const todos = this.findAll();
    const index = todos.findIndex(t => t.id === id);
    if (index !== -1) {
      todos[index] = { ...todos[index], ...updatedTodo };
      this.saveAll(todos);
      return todos[index];
    }
    return null;
  }

  static delete(id) {
    const todos = this.findAll();
    const filteredTodos = todos.filter(t => t.id !== id);
    this.saveAll(filteredTodos);
    return filteredTodos.length !== todos.length;
  }

  static search(query) {
    const todos = this.findAll();
    const searchTerm = query.toLowerCase();
    return todos.filter(todo => 
      todo.title.toLowerCase().includes(searchTerm)
    );
  }
}

module.exports = Todo;