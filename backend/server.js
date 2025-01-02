'use strict';

import cors from 'cors';
import express from 'express';
import { initDB } from './db/database.js';
import userRoutes from './routes/users.js';
import todoRoutes from './routes/todos.js';

const server = express();

server.use(express.static('public', {
  extensions: ['html']
}));

server.use(express.json());
server.use(cors());

server.use('/user', userRoutes);
server.use('/todos', todoRoutes);

const init = () => {
  initDB();
  server.listen(5000, error => console.log(error || 'Server läuft'));
}

init();