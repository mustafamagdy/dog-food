# Todos API

A minimal todos REST API built with Express.

## Run

```bash
npm install
npm start        # serves http://localhost:3000
```

## Endpoints

| Method | Path           | Description                          |
|--------|----------------|--------------------------------------|
| GET    | `/todos`       | List all todos.                      |
| POST   | `/todos`       | Create a todo (`{ "title": "..." }`).|
| DELETE | `/todos/:id`   | Delete a todo by id. Returns `204 No Content` on success, `404` if the id doesn't exist, `400` if the id is invalid. |

## Tests

```bash
npm test
```
