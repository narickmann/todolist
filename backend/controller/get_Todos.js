'use strict';

import { connection, userDB } from "../db/database.js";

const getTodos = async (request, response) => {
  let db = connection.use(userDB);
  const { username, type } = request.params;

  if (!username || !type) {
    return response.status(400).json({ error: 'Benutzername und Typ erforderlich' });
  }

  if (!['active', 'completed'].includes(type)) {
    return response.status(400).json({ error: 'Ungültiger Typ. Erlaubt sind: active oder completed' })
  }

  try {
    const result = await db.find({ selector: { username: username } });

    if (result.docs.length === 0) {
      return response.status(404).json({ error: 'Benutzer nicht gefunden' });
    }

    const user = result.docs[0];
    const todos = type === 'active' ? user.todos : user.done;

    return response.status(200).json(todos);
  } catch (error) {
    console.error('Fehler:', error);
    return response.status(500).json({ error: 'Fehler beim Abrufen der ToDos' });
  }
}

const searchTodo = async (request, response) => {
  let db = connection.use(userDB);

  const { username, type } = request.params;
  const { query } = request.query;

  if (!username || !type) {
    return response.status(400).json({ error: 'Benutzername und Typ erforderlich' });
  }

  if (!['active', 'completed'].includes(type)) {
    return response.status(400).json({ error: 'Ungültiger Typ. Erlaubt sind: active oder completed' })
  }

  if (!query) {
    return response.status(400).json({ error: 'Suchbegriff erforderlich' });
  }

  try {
    const result = await db.find({ selector: { username: username } });

    if (result.docs.length === 0) {
      return response.status(404).json({ error: 'Benutzer nicht gefunden' });
    }

    const user = result.docs[0];
    const todos = type === 'active' ? user.todos : user.done;
    const filteredTodos = todos.filter(todo => todo.todo.toLowerCase().includes(query.toLowerCase()));

    return response.status(200).json(filteredTodos);
  } catch (error) {
    console.error('Fehler:', error);
    return response.status(500).json({ error: 'Fehler beim Suchen der ToDos' });
  }
}

export { getTodos, searchTodo };