'use strict';

import { connection, userDB } from "../db/database.js";

const addNewUser = async (request, response) => {
  let db = connection.use(userDB);

  const user = request.body;
  const username = request.body.username;
  const password = request.body.password;
  const email = request.body.email;

  if (!user || !username) {
    return response.status(400).json({ error: 'Bitte einen Benutzernamen angeben' });
  }

  const newUser = {
    email: email,
    username: username,
    password: password,
    todos: [],
    done: []
  }

  try {
    const result = await db.find({ selector: { username: username } });

    if (result.docs.length > 0) {
      return response.status(400).json({ error: 'Benutzername bereits vergeben.' });
    }

    await db.insert(newUser);
    return response.status(200).json('Benutzer erfolgreich hinzugefügt');

  } catch (error) {
    console.error('Fehler:', error);
    return response.status(500).json({ error: 'Fehler beim Hinzufügen des Benutzers' });
  }
}

const getUser = async (request, response) => {
  let db = connection.use(userDB);

  const user = request.query.username;

  if (!user) {
    return response.status(400).json({ error: 'Benutzername fehlt' });
  }

  try {
    const result = await db.find({ selector: { username: user } });

    if (result.docs.length === 0) {
      return response.status(404).json({ error: 'Benutzer nicht gefunden' });
    } else {
      return response.json(result.docs[0]);
    }

  } catch (error) {
    return response.status(500).json(`Fehler bei der Suche: ${error}`);
  }
}

export { addNewUser, getUser };
