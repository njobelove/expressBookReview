const axios = require('axios');

// Get all books
async function getAllBooks() {
    try {
        const response = await axios.get('http://localhost:5000/books');
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

// Get book by ISBN
async function getBookByISBN(isbn) {
    try {
        const response = await axios.get(`http://localhost:5000/books/${isbn}`);
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

// Get books by author
async function getBooksByAuthor(author) {
    try {
        const response = await axios.get(`http://localhost:5000/books/author/${encodeURIComponent(author)}`);
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

// Get books by title
async function getBooksByTitle(title) {
    try {
        const response = await axios.get(`http://localhost:5000/books/title/${encodeURIComponent(title)}`);
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

module.exports = { getAllBooks, getBookByISBN, getBooksByAuthor, getBooksByTitle };