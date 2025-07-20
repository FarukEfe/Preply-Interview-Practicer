import express from 'express';
import { createTask, analyzeVideo, getTasks, createIndex, getIndex } from "../controllers/twelve.controller.js";
// Add this to your twelve.routes.js
import { checkIndexSupport } from '../controllers/twelve.controller.js';

const router = express.Router();

// Upload create video task and analyze instantly with prompt
router.get('/tasks', getTasks);
router.post('/analyze', analyzeVideo);
router.post('/createtask', createTask);
router.post('/createindex', createIndex);
router.get('/index', getIndex);
router.get('/check-index/:indexId', checkIndexSupport);

export default router;