const express = require('express');
const app = express();
const PORT = 5000;

app.use(express.json());

// Book database
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
    }
];

let users = [];
let sessions = {};

// Task 1: Get all books
app.get('/books', (req, res) => {
    console.log('GET /books - Returning all books');
    res.json(books);
});

// Task 2: Get book by ISBN
app.get('/books/:isbn', (req, res) => {
    console.log(`GET /books/${req.params.isbn}`);
    const book = books.find(b => b.isbn === req.params.isbn);
    book ? res.json(book) : res.status(404).json({ message: "Book not found" });
});

// Task 3: Get books by author
app.get('/books/author/:author', (req, res) => {
    const author = decodeURIComponent(req.params.author).toLowerCase();
    console.log(`GET /books/author/${author}`);
    const result = books.filter(b => b.author.toLowerCase() === author);
    res.json(result);
});

// Task 4: Get book by title
app.get('/books/title/:title', (req, res) => {
    const title = decodeURIComponent(req.params.title).toLowerCase();
    console.log(`GET /books/title/${title}`);
    const book = books.find(b => b.title.toLowerCase() === title);
    book ? res.json(book) : res.status(404).json({ message: "Book not found" });
});

// Task 5: Get book reviews
app.get('/books/review/:isbn', (req, res) => {
    console.log(`GET /books/review/${req.params.isbn}`);
    const book = books.find(b => b.isbn === req.params.isbn);
    if (book) {
        res.json({ isbn: book.isbn, title: book.title, reviews: book.reviews });
    } else {
        res.status(404).json({ message: "Book not found" });
    }
});

// Task 6: Register user
app.post('/register', (req, res) => {
    console.log('POST /register', req.body);
    const { username, password } = req.body;
    
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password required" });
    }
    
    if (users.find(u => u.username === username)) {
        return res.status(400).json({ message: "User already exists" });
    }
    
    users.push({ username, password });
    res.json({ message: "User registered successfully" });
});

// Task 7: Login
app.post('/login', (req, res) => {
    console.log('POST /login', req.body);
    const { username, password } = req.body;
    
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        const token = Buffer.from(`${username}:${Date.now()}`).toString('base64');
        sessions[token] = username;
        res.json({ message: "Login successful", token: token });
    } else {
        res.status(401).json({ message: "Invalid credentials" });
    }
});

// Task 8: Add/Modify review
app.put('/books/review/:isbn', (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    console.log(`PUT /books/review/${req.params.isbn}`, { token: token ? 'present' : 'missing' });
    
    if (!token || !sessions[token]) {
        return res.status(401).json({ message: "Unauthorized. Please login first." });
    }
    
    const username = sessions[token];
    const { rating, comment } = req.body;
    const book = books.find(b => b.isbn === req.params.isbn);
    
    if (!book) {
        return res.status(404).json({ message: "Book not found" });
    }
    
    const existingIndex = book.reviews.findIndex(r => r.username === username);
    if (existingIndex >= 0) {
        book.reviews[existingIndex] = { username, rating, comment, updatedAt: new Date() };
        res.json({ message: "Review updated successfully", reviews: book.reviews });
    } else {
        book.reviews.push({ username, rating, comment, createdAt: new Date() });
        res.json({ message: "Review added successfully", reviews: book.reviews });
    }
});

// Task 9: Delete review
app.delete('/books/review/:isbn', (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    console.log(`DELETE /books/review/${req.params.isbn}`);
    
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
    console.log(`\n✅ Book Review API Server is RUNNING!`);
    console.log(`📍 URL: http://localhost:${PORT}`);
    console.log(`📚 Test: curl http://localhost:${PORT}/books\n`);
});