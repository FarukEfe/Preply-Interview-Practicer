import express from 'express';
import { createTask, analyzeVideo, getTasks, createIndex } from "../controllers/twelve.controller.js";

const router = express.Router();

// Upload create video task and analyze instantly with prompt
router.get('/tasks', getTasks);
router.post('/analyze', analyzeVideo);
router.post('/createtask', createTask);
router.post('/createindex', createIndex);

export default router;