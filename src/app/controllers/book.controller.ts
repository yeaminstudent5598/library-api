import { Request, Response } from "express";
import bookModel from "../models/book.model";


export const createBook = async (req: Request, res: Response) => {
  try {
    const book = await bookModel.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Book created successfully',
      data: book
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Validation failed',
      error
    });
  }
};

export const getAllBooks = async (req: Request, res: Response) => {
  const { filter, sortBy = 'createdAt', sort = 'asc', limit = '10' } = req.query;
  const query: any = {};
  if (filter) query.genre = filter;

  try {
    const books = await bookModel.find(query)
      .sort({ [sortBy as string]: sort === 'asc' ? 1 : -1 })
      .limit(parseInt(limit as string));
   console.log(books)
    res.json({
      success: true,
      message: 'Books retrieved successfully',
      data: books
    });
  } catch (error) {
    console.log("error showing", error)
    res.status(500).json({ success: false, message: 'Error retrieving books', error });
  }
};

export const getBookById = async (req: Request, res: Response) => {
  try {
    const book = await bookModel.findById(req.params.bookId);
    res.json({ success: true, message: 'Book retrieved successfully', data: book });
  } catch (error) {
    res.status(404).json({ success: false, message: 'Book not found', error });
  }
};

export const updateBook = async (req: Request, res: Response) => {
  try {
    const book = await bookModel.findByIdAndUpdate(req.params.bookId, req.body, { new: true });
    res.json({ success: true, message: 'Book updated successfully', data: book });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Error updating book', error });
  }
};

export const deleteBook = async (req: Request, res: Response) => {
  try {
    await bookModel.findByIdAndDelete(req.params.bookId);
    res.json({ success: true, message: 'Book deleted successfully', data: null });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Error deleting book', error });
  }
};