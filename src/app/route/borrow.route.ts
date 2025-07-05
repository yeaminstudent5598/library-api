import express from 'express';
import { borrowBook, getBorrowedSummary } from '../controllers/borrow.controller';


export const borrowRoutes = express.Router();

borrowRoutes.post('/', borrowBook);
borrowRoutes.get('/', getBorrowedSummary);
