import express from 'express';
import { signUp, signIn } from '../controllers/user.controller.js';

const router = express.Router();

// User sign up route
router.post('/signup', signUp);
// User sign in route
router.post('/signin', signIn);

export default router;