import express from 'express';
import { getFlows, getFlow, createFlow, getInterviews, getInterview, createInterview } from '../controllers/ribbon.controller.js';

const router = express.Router();

// MARK: Flow Routes
router.get('/flows', getFlows); // ?userId=123
router.post('/createflow', createFlow); // ?userId=123
router.get('/flows/:userId/:flowId', getFlow);

// MARK: Interview Routes
router.get('/interviews', getInterviews); // ?userId=123
router.post('/createinterview', createInterview); // ?userId=123
router.get('/interviews/:userId/:interviewId', getInterview);

export default router;