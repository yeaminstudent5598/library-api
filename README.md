# 📚 Library Management API with Express, TypeScript & MongoDB

A simple Express + MongoDB backend for managing library books and borrow records.

---

## 📦 Tech Stack

- Node.js
- Express.js
- MongoDB + Mongoose
- TypeScript
- Vercel (deployment)

---
## 🧠 Features

🔸 Custom validation using Mongoose schema rules

🔸 Automatically mark a book as unavailable if copies reach zero

🔸 Aggregation pipeline to get borrowed book stats (title, ISBN, total quantity)

🔸 Middleware to clean up borrows when a book is deleted (findOneAndDelete)

_ _ _

## 📁 Folder Structure

```text
src/
│
├── app/
│   ├── app.ts                    # Express app setup
│   └── server.ts                 # Server entry point
│
├── controller/
│   ├── book_controller.ts        # Book API endpoints
│   └── borrow_controller.ts      # Borrow API endpoints
│
├── model/
│   ├── book_model.ts             # Book schema and pre middleware
│   └── borrow_model.ts           # Borrow schema and instance method
│
├── interface/
│   ├── book_interface.ts
│   └── borrow_interface.ts
```
## 🗂️ Models

This project uses **Mongoose** to define two main data models: **Book** and **Borrow**. They represent the core of the library management system.

---

### 📚 Book Model (`book_model.ts`)

The **Book** model stores details about each book in the library, including:

- `title`: The book’s title (required).
- `author`: The author’s name (required).
- `genre`: Book genre, restricted to specific categories (e.g., FICTION, SCIENCE).
- `isbn`: Unique ISBN number (required and unique).
- `description`: Optional description text.
- `copies`: Number of copies available (must be zero or more).
- `available`: Boolean to mark if the book is currently available (default: true).

**Special Behavior:**  
When a **book is deleted**, a Mongoose pre-delete hook automatically deletes all borrow records referencing that book to maintain data integrity.

---

### 🔖 Borrow Model (`borrow_model.ts`)

The **Borrow** model tracks the borrowing records of books:

- `book`: Reference to a Book document (required).
- `quantity`: Number of copies borrowed (minimum 1, required).
- `dueDate`: Date by which the book should be returned (required).

**Instance Methods:**

- `updateAvailableBook(bookId)`: Marks the referenced book as unavailable (sets `available` to false).

---

### Relationships

- **Borrow documents** reference **Book documents** by their ObjectId.
- Deleting a **Book** triggers removal of all associated **Borrow** records to maintain data integrity.

---


## 🚀 Setup Instructions
## 🛠️ Local Setup (Quick Start)

1. **Clone the repository**
   ```bash
   git clone https://github.com/Rdm-jony/level2_assignment_3.git
   cd level2_assignment_3
   
2. **Install dependencies**
   ```bash
   npm install

3. **Add your MongoDB credentials in the .env file:**
    ```bash
    DB_USER=your_username
    DB_PASS=your_password
    
4. **Start the development server**
    ```bash
    npm run dev


### 🌐 Live Demo:
🔗 https://librarybeckend.vercel.app/

_ _ _
## 📘 API Endpoints

### 🔹 Books

| Method | Endpoint         | Description                           |
| ------ | ---------------- | ------------------------------------- |
| GET    | `/books`         | Get all books (with optional filters) |
| GET    | `/books/:bookId` | Get a specific book                   |
| POST   | `/books`         | Create a new book                     |
| PUT    | `/books/:bookId` | Update a book                         |
| DELETE | `/books/:bookId` | Delete a book                         |

### ✅ Optional Query Parameters (GET /books)

filter — filter by genre

sortBy — sort field (e.g., title)

sort — asc or desc

limit — number of results (default: 4)

### 🔹 Borrow Records

| Method | Endpoint   | Description                   |
| ------ | ---------- | ----------------------------- |
| POST   | `/borrows` | Borrow a book                 |
| GET    | `/borrows` | Get summary of borrowed books |

_ _ _




