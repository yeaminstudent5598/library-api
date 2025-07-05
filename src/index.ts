import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import { connectDB } from './config/db';
import { Error } from 'mongoose';
import { bookRoutes } from './app/route/book.route';
import { borrowRoutes } from './app/route/borrow.route';



dotenv.config();
const app = express();
app.use(
  cors({
    origin: ['http://localhost:5173', 'https://library-api-theta.vercel.app']
   })
);
app.use(express.json());

connectDB();

// routes
app.use('/api/books/borrow-summary', borrowRoutes);
app.use('/api/books', bookRoutes);

// error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction  ) => {
  res.status(500).json({
    success: false,
    message: 'Something went wrong',
    error: err,
  });
});

export default app;
