'use strict';

import express from 'express';

import { addNewUser, getUser } from '../controller/user.js';

const router = express();

router.get('/', getUser);
router.post('/new-user', addNewUser);

export default router;