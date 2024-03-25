
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser';


// router imports
import loginRouter from './router/loginRouter.js';
import { globaldata } from './query.js';
import feedRouter from './router/feedRouter.js';
import problemRouter from './router/problemRouter.js';

dotenv.config();
const app = express();
app.use(cors({
    origin:"https://codecapture.vercel.app",
    credentials:true
}));
app.use(express.json());
app.use(cookieParser());

app.use('/login',loginRouter);
app.use('/feed',feedRouter);
app.use('/problem',problemRouter)


export default app;