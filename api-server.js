const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

// Sample book database
const books = [
    {
        isbn: "9780141439518",
        title: "Pride and Prejudice",
        author: "Jane Austen",
        reviews: []
    },
    {
        isbn: "9780061120084",
        title: "To Kill a Mockingbird",
        author: "Harper Lee",
        reviews: []
    },
    {
        isbn: "9780451524935",
        title: "1984",
        author: "George Orwell",
        reviews: []
    },
    {
        isbn: "9780743273565",
        title: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        reviews: []
    }
];

// Store registered users
let users = [];
let sessions = {};

// TASK 1: Get all books
app.get('/books', (req, res) => {
    res.json(books);
});

// TASK 2: Get books by ISBN
app.get('/books/:isbn', (req, res) => {
    const book = books.find(b => b.isbn === req.params.isbn);
    if (book) {
        res.json(book);
    } else {
        res.status(404).json({ message: "Book not found" });
    }
});

// TASK 3: Get books by Author
app.get('/books/author/:author', (req, res) => {
    const authorName = decodeURIComponent(req.params.author).toLowerCase();
    const authorBooks = books.filter(b => b.author.toLowerCase() === authorName);
    res.json(authorBooks);
});

// TASK 4: Get books by Title
app.get('/books/title/:title', (req, res) => {
    const titleName = decodeURIComponent(req.params.title).toLowerCase();
    const book = books.find(b => b.title.toLowerCase() === titleName);
    if (book) {
        res.json(book);
    } else {
        res.status(404).json({ message: "Book not found" });
    }
});

// TASK 5: Get book reviews
app.get('/books/review/:isbn', (req, res) => {
    const book = books.find(b => b.isbn === req.params.isbn);
    if (book) {
        res.json({
            isbn: book.isbn,
            title: book.title,
            reviews: book.reviews
        });
    } else {
        res.status(404).json({ message: "Book not found" });
    }
});

// TASK 6: Register new user
app.post('/register', (req, res) => {
    const { username, password } = req.body;
    
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password required" });
    }
    
    const userExists = users.find(u => u.username === username);
    if (userExists) {
        return res.status(400).json({ message: "User already exists" });
    }
    
    users.push({ username, password });
    res.json({ message: "User registered successfully" });
});

// TASK 7: Login as registered user
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        const token = Buffer.from(`${username}:${Date.now()}`).toString('base64');
        sessions[token] = username;
        res.json({ 
            message: "Login successful", 
            token: token 
        });
    } else {
        res.status(401).json({ message: "Invalid credentials" });
    }
});

// TASK 8: Add/Modify book review
app.put('/books/review/:isbn', (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token || !sessions[token]) {
        return res.status(401).json({ message: "Unauthorized. Please login first." });
    }
    
    const username = sessions[token];
    const { rating, comment } = req.body;
    const book = books.find(b => b.isbn === req.params.isbn);
    
    if (!book) {
        return res.status(404).json({ message: "Book not found" });
    }
    
    const existingReviewIndex = book.reviews.findIndex(r => r.username === username);
    
    if (existingReviewIndex >= 0) {
        book.reviews[existingReviewIndex] = { username, rating, comment, updatedAt: new Date() };
        res.json({ message: "Review updated successfully", reviews: book.reviews });
    } else {
        book.reviews.push({ username, rating, comment, createdAt: new Date() });
        res.json({ message: "Review added successfully", reviews: book.reviews });
    }
});

// TASK 9: Delete book review
app.delete('/books/review/:isbn', (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token || !sessions[token]) {
        return res.status(401).json({ message: "Unauthorized. Please login first." });
    }
    
    const username = sessions[token];
    const book = books.find(b => b.isbn === req.params.isbn);
    
    if (!book) {
        return res.status(404).json({ message: "Book not found" });
    }
    
    const reviewIndex = book.reviews.findIndex(r => r.username === username);
    
    if (reviewIndex >= 0) {
        book.reviews.splice(reviewIndex, 1);
        res.json({ message: "Review deleted successfully", reviews: book.reviews });
    } else {
        res.status(404).json({ message: "Review not found" });
    }
});

app.listen(PORT, () => {
    console.log(`✅ Book Review API Server running on http://localhost:${PORT}`);
    console.log(`📚 Test: curl http://localhost:${PORT}/books`);
});