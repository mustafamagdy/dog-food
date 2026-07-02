// Health check: Todos API server entry point.
const express = require('express');
const { randomUUID } = require('crypto');
const { createLogger } = require('./logger');

// In-memory todo store (keyed by numeric id).
const todos = new Map();
let nextId = 1;

function createTodo(title) {
  const id = nextId++;
  const todo = { id, title, completed: false };
  todos.set(id, todo);
  return todo;
}

// Build an Express application.
//
// `logger` is optional: pass a Pino logger (e.g. one built by `createLogger`
// with a custom destination stream) to capture request-log output in tests.
// When omitted, the default logger writing to stdout is used.
function createApp({ logger } = {}) {
  const app = express();
  const log = logger || createLogger();

  app.use(express.json());

  // Pino request-logging middleware.
  //
  // Mounted immediately after express.json() and before any route, so every
  // request — including error responses (400/404/500) — is logged. Emits
  // EXACTLY ONE structured JSON line per request on `finish`, guarded by an
  // emitted-flag so error/abort paths cannot double-log. Logs method, path
  // (the request path WITHOUT the query string), status, durationMs, and a
  // per-request requestId. Never logs request/response bodies or headers.
  app.use((req, res, next) => {
    req.id = randomUUID();
    const start = process.hrtime.bigint();
    let emitted = false;
    res.on('finish', () => {
      if (emitted) return;
      emitted = true;
      const durationMs = Number((process.hrtime.bigint() - start) / 1000000n);
      log.info({
        method: req.method,
        path: req.path,
        status: res.statusCode,
        durationMs,
        requestId: req.id,
      });
    });
    next();
  });

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

  return app;
}

// Default application instance (used by `npm start`).
const app = createApp();

if (require.main === module) {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Todos app listening on http://localhost:${port}`);
  });
}

module.exports = { app, createApp, createTodo };
