'use strict';

import { v4 as uuidv4 } from 'uuid';

import { connection, userDB } from '../db/database.js';

const addNewTodo = async (request, response) => {
  let db = connection.use(userDB);

  const { username, todo } = request.body;

  if (!todo) {
    return response.status(400).json('Bitte ein ToDo angeben');
  }

  const newTodo = {
    todoID: uuidv4(),
    todo: todo,
    completed: false,
    important: false
  }

  try {
    const result = await db.find({ selector: { username: username } });

    if (result.docs.length === 0) {
      return response.status(404).json({ error: 'Benutzer nicht gefunden' });
    }
    const user = result.docs[0];
    user.todos.push(newTodo);

    await db.insert(user);
    return response.status(200).json('ToDo erfolgreich hinzugefügt');

  } catch (error) {
    console.error('Fehler:', error);
    return response.status(500).json({ error: 'Fehler beim Hinzufügen des ToDos' });
  }
}

const editTodo = async (request, response) => {
  let db = connection.use(userDB);

  const { username, todoID, updatedTodo } = request.body;

  if (!updatedTodo || !todoID) {
    return response.status(400).json('ToDo zum Bearbeiten nicht gefunden');
  }

  try {
    const result = await db.find({ selector: { username: username } });
    
    if (result.docs.length === 0) {
      return response.status(404).json({ error: 'Benutzer nicht gefunden' });
    }

    const user = result.docs[0];

    const todoIndex = user.todos.findIndex((todo) => todo.todoID === todoID);
    if (todoIndex === -1) {
      return response.status(404).json({ error: 'ToDo nicht gefunden' });
    }

    user.todos[todoIndex] = { ...user.todos[todoIndex], ...updatedTodo };
    await db.insert(user);

    return response.status(200).json('ToDo erfolgreich geändert')
  } catch (error) {
    console.error('Fehler:', error);
    return response.status(500).json({ error: 'Fehler beim Bearbeiten des ToDos' });
  }
}

const deleteTodo = async (request, response) => {
  let db = connection.use(userDB);

  const todoID = request.params.id;
  const username = request.params.username;

  if (!username || !todoID) {
    return response.status(400).json('ToDo nicht gefunden, Benutzername und ID erforderlich');
  }

  try {
    const result = await db.find({ selector: { username: username } })

    if (result.docs.length === 0) {
      return response.status(404).json({ error: 'Benutzer nicht gefunden' });
    }

    const user = result.docs[0];
    const todoIndex = user.todos.findIndex((todo) => todo.todoID === todoID);

    if (todoIndex === -1) {
      return response.status(404).json({ error: 'ToDo nicht gefunden' });
    }

    user.todos.splice(todoIndex, 1);

    await db.insert(user);
    return response.status(200).json('ToDo erfolgreich gelöscht');

  } catch (error) {
    console.error('Fehler beim Löschen: ', error);
    response.status(500).send(`Fehler beim Löschen: ${error.message}`);
  }
}

const toggleTodoCompletion = async (request, response) => {
  let db = connection.use(userDB);

  const { username, todoID, markAsDone } = request.body;

  if (!username || !todoID || markAsDone === undefined) {
    return response.status(400).json('Benutzername, ID und Aktion erforderlich');
  }

  try {
    const result = await db.find({ selector: { username: username } });

    if (result.docs.length === 0) {
      return response.status(404).json({ error: 'Benutzer nicht gefunden' });
    }

    const user = result.docs[0];

    if (markAsDone) {
      const todoIndex = user.todos.findIndex((todo) => todo.todoID === todoID);

      if (todoIndex === -1) {
        return response.status(404).json({ error: 'ToDo nicht gefunden' });
      }

      const [completedTodo] = user.todos.splice(todoIndex, 1);
      
      completedTodo.completed = true;
      user.done.push(completedTodo);

    } else {
      const doneIndex = user.done.findIndex((todo) => todo.todoID === todoID);

      if (doneIndex === -1) {
        return response.status(404).json({ error: 'ToDo nicht gefunden' });
      }

      const [incompleteTodo] = user.done.splice(doneIndex, 1);
      incompleteTodo.completed = false;
      user.todos.push(incompleteTodo);
    }

    await db.insert(user);
    return response.status(200).json('ToDo-Status erfolgreich geändert');

  } catch (error) {
    console.error('Fehler beim Verschieben des ToDos: ', error);
    return response.status(500).json({ error: 'Fehler beim Verschieben des ToDos' })
  }
}

export { addNewTodo, editTodo, deleteTodo, toggleTodoCompletion };