import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import twelveRouter from './routes/twelve.route.js';
import userRouter from './routes/user.route.js';
import ribbonRouter from './routes/ribbon.route.js';
import { connectDB } from './lib/db.js';

dotenv.config();
const app = express();

const PORT = process.env.PORT || 5001;

app.use(express.json());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}))

app.use('/api/twelve', twelveRouter)
app.use('/api/ribbon', ribbonRouter)
app.use('/api/user', userRouter);
// app.use('/api/video', )
app.get('/', (req, res) => {
    res.status(200).json({ message: "Welcome to Ribbon API Template" });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    connectDB();
});