import { model, Schema } from "mongoose";
import { IBook } from "../interface/book_interface";
import { Borrow } from "./borrow_model";

const bookShema = new Schema<IBook>({
    title: { type: String, required: [true, "Book title is required"], trim: true },
    author: { type: String, required: [true, "author is required"], trim: true },
    genre: { type: String, enum: ["FICTION", "NON_FICTION", "SCIENCE", "HISTORY", "BIOGRAPHY", "FANTASY"], required: true, default: "FICTION" },
    isbn: { type: String, unique: [true, "isbn must be unique"], required: [true, "isbn is required"] },
    description: { type: String },
    copies: { type: Number, required: [true, "Book copies is required"], min: [0, "copies must be a non negative number"] },
    available: { type: Boolean, default: true },
    image: { type: String, required: [true, 'image is required'] }
}, {
    versionKey: false,
    timestamps: true
})

bookShema.pre("deleteOne", async function (next) {
    await Borrow.deleteMany({
        book: this.getFilter()._id
    })
    next()
})

export const Book = model("Book", bookShema)