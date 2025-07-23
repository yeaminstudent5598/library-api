import express, { json, Request, response, Response } from "express"
import { Book } from "../model/book_model"
import { imagekit } from "../utils/imageKit"
import upload from "../middleware/middleware"

export const bookRoutes = express.Router()

bookRoutes.post("/", upload.single("image"), async (req: Request, res: Response): Promise<any> => {
    try {
        const body = req.body
        const imageFile = req.file
        if (!imageFile) {
            return res.status(400).json({
                success: false,
                message: "Image file is required"
            });
        }
        const response = await imagekit.upload({
            file: imageFile?.buffer,
            fileName: imageFile?.originalname,
        })
        if (!response.url) {
            return res.status(500).json({
                success: false,
                message: "Image upload failed. No URL returned."
            });
        }

        const data = await Book.create({ ...body, image: response.url })
        res.status(201).json({ success: true, message: "Book created successfully", data })
    } catch (error: any) {
        console.log(error);
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

bookRoutes.get("/", async (req: Request, res: Response): Promise<any> => {
    try {
        const filter = req.query.filter as string
        const sortBy = req.query.sortBy as string
        const sort = req.query.sort as string
        const limit = req.query.limit as string
        const sortField = sort == "asc" ? 1 : -1
        const data = await Book.find(filter ? { genre: filter } : {}).sort({ [sortBy]: sortField }).limit(Number(limit))
        res.status(200).json({ success: true, message: "Books retrieved successfully", data })
    } catch (error: any) {
        console.log(error)
        res.status(500).json({
            success: false, message: error.message || 'something went wrong', error: {
                name: error.name,
                errors: error.errors
            }
        })
    }
})



bookRoutes.put("/:bookId", upload.single('image'), async (req: Request, res: Response): Promise<any> => {
    try {
        const bookId = req.params.bookId
        const body = req.body
        const imageFile = req.file
        let imageUrl = body.image
        if (imageFile) {
            const response = await imagekit.upload({
                file: imageFile?.buffer,
                fileName: imageFile?.originalname,
            })
            if (!response.url) {
                return res.status(500).json({
                    success: false,
                    message: "Image upload failed. No URL returned."
                });
            }
            imageUrl = response.url
        }
        const updateDoc = {
            $set: { ...body, image: imageUrl, available: body.copies == 0 ? false : true }
        }
        const data = await Book.findByIdAndUpdate(bookId, updateDoc, { new: true })
        res.status(200).json({ success: true, message: "Book updated successfully", data })
    } catch (error: any) {
        console.log(error);
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

bookRoutes.delete("/:bookId", async (req: Request, res: Response): Promise<any> => {
    try {
        const bookId = req.params.bookId
        const data = await Book.deleteOne({ _id: bookId })
        if (data.deletedCount) {
            return res.status(200).json({ success: true, message: "Book deleted successfully", data: null })
        }
        res.status(200).json({ success: false, message: "Book not found" })

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

bookRoutes.get("/categories", async (req: Request, res: Response): Promise<any> => {
    try {
        const data = await Book.aggregate([
            {
                $group: {
                    _id: "$genre",
                    img: { $first: "$image" }
                }
            },
            {
                $project: {
                    _id: 0,
                    genre: "$_id",
                    img: 1
                }
            }
        ]);
        res.status(200).json({ success: true, data });
    } catch (error: any) {
        res.status(500).json({
            success: false, message: error.name, error: {
                name: error.name,
                errors: error.errors
            }
        })
    }
})

bookRoutes.get("/:bookId", async (req: Request, res: Response) => {
    try {
        const bookId = req.params.bookId
        const data = await Book.findById(bookId)
        res.status(200).json({ success: true, message: "Books retrieved successfully", data })

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