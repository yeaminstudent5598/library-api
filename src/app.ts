import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import { bookRoutes } from "./app/controller/book_controller"
import { borrowRoutes } from "./app/controller/borrow_controller"

dotenv.config()
const app = express()
app.use(express.json())
app.use(cors({ origin: ['https://library-client-side.netlify.app'] }))
app.use("/api/books", bookRoutes)
app.use("/api/borrow", borrowRoutes)

export default app;