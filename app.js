const express = require('express');

const app = express();
app.use(express.json());

// In-memory todo store (keyed by numeric id).
const todos = new Map();
let nextId = 1;

function createTodo(title) {
  const id = nextId++;
  const todo = { id, title, completed: false };
  todos.set(id, todo);
  return todo;
}

// List all todos.
app.get('/todos', (req, res) => {
  res.json([...todos.values()]);
});

// Create a todo.
app.post('/todos', (req, res) => {
  const { title } = req.body || {};
  if (!title || typeof title !== 'string' || !title.trim()) {
    return res.status(400).json({ error: 'title is required' });
  }
  res.status(201).json(createTodo(title.trim()));
});

// Delete a todo by id.
app.delete('/todos/:id', (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ error: 'invalid id' });
  }
  if (!todos.has(id)) {
    return res.status(404).json({ error: 'todo not found' });
  }
  todos.delete(id);
  res.status(204).end();
});

if (require.main === module) {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Todos app listening on http://localhost:${port}`);
  });
}

module.exports = { app, createTodo };
