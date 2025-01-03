'use strict';

import nano from 'nano';
import credentials from '../data/credentials.json' with { type: 'json' };

const connection = nano(`http://${credentials.user}:${credentials.password}@${credentials.url}`).db;

const userDB = 'todo-user';

const initDB = async () => {
  try {
    const response = await connection.list();
    if (!response.includes(userDB)) {
      return connection.create(userDB);
    } else {
      'Datenbank mit diesem Namen existiert bereits'
    }
  } catch (error) {
    console.warn(error);
  }
}

export { initDB, connection, userDB };