import { Model, model, Schema } from "mongoose";
import { BorrowMethod, IBorrow } from "../interface/borrow_interface";
import { Book } from "./book_model";

const borrowShema = new Schema<IBorrow, Model<IBorrow>, BorrowMethod>({
    book: { type: Schema.Types.ObjectId, ref: "Book", required: [true, "book_id is required"] },
    quantity: { type: Number, min: [1, "select at least 1 quantity"], required: [true, "quantity is required"] },
    dueDate: { type: Date, required: [true, "dueDate is required"] }
}, {
    versionKey: false,
    timestamps: true
})

borrowShema.method("updateAvailableBook", async function (bookId: Schema.Types.ObjectId) {

    await Book.findByIdAndUpdate(bookId, { $set: { available: false } })
})

borrowShema.pre("deleteOne", function (next) {
    console.log(this.getFilter())
})

export const Borrow = model("Borrow", borrowShema)