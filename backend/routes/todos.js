'use strict';

import express from 'express';

import { addNewTodo, deleteTodo, editTodo, toggleTodoCompletion } from '../controller/post_Todos.js';
import { getTodos, searchTodo } from '../controller/get_Todos.js';

const router = express();

router.get('/:username/:type', getTodos);
router.get('/search/:username/:type', searchTodo);

router.post('/add-todo', addNewTodo);
router.put('/edit-todo', editTodo);
router.delete('/delete-todo/:username/:id', deleteTodo);
router.put('/edit-completion', toggleTodoCompletion);

export default router;