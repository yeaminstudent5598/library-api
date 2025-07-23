import express, { Request, Response } from "express"
import { Book } from "../model/book_model"
import { Borrow } from "../model/borrow_model"

export const borrowRoutes = express.Router()

borrowRoutes.post("/", async (req: Request, res: Response): Promise<any> => {
    try {
        const { book, quantity, dueDate } = req.body
        const findBook = await Book.findById(book)
        if (!findBook) {
            return res.status(404).json({ success: false, message: "Book not found" })
        }

        if (!findBook.available || findBook.copies == 0) {
            return res.status(409).json({ success: false, message: "Book is not available" })

        }

        if (findBook.copies < quantity) {
            return res.status(409).json({ success: false, message: `Available copies ${findBook.copies}` })
        }


        const data = new Borrow({ book, quantity, dueDate })

        await data.save()

        findBook.copies -= data.quantity
        if (findBook.copies == 0) {
            await data.updateAvailableBook(findBook._id)

        }
        await findBook.save()
        res.status(201).json({ success: true, message: `Book borrowed successfully`, data })


    } catch (error: any) {
        console.log(error)
        if (error.code === 11000) {
            const field = Object.keys(error.keyValue)[0];
            return res.status(400).json({
                success: false,
                message: "Validation Error",
                errors: [
                    {
                        field,
                        message: `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`
                    }
                ]
            });
        }

        // 🔴 Mongoose Validation Error
        if (error.name === "ValidationError") {
            const errors = Object.keys(error.errors).map((field) => ({
                field,
                message: error.errors[field].message
            }));

            return res.status(400).json({
                success: false,
                message: "Validation Error",
                errors
            });
        }

        // ⚫ Generic Server Error
        return res.status(500).json({
            success: false,
            message: error.message || "Something went wrong"
        });
    }
})

borrowRoutes.get("/", async (req: Request, res: Response) => {
    try {
        const data = await Borrow.aggregate([
            {
                $lookup: {
                    from: "books",
                    localField: "book",
                    foreignField: "_id",
                    as: "book"
                }
            },
            {
                $unwind: "$book"
            },
            {
                $group: {
                    _id: {
                        title: "$book.title",
                        isbn: "$book.isbn",
                        image: "$book.image"
                    }, totalQuantity: { $sum: "$quantity" }
                }
            },
            {
                $project: {
                    _id: 0,
                    book: {
                        title: "$_id.title",
                        isbn: "$_id.isbn",
                        image: "$_id.image",

                    },
                    totalQuantity: 1
                }
            }


        ])

        res.json({ success: true, message: "Borrowed books summary retrieved successfully", data })
    } catch (error: any) {
        console.log(error)
        res.status(500).json({
            success: false, message: error.name, error: {
                name: error.name,
                errors: error.errors
            }
        })
    }
})