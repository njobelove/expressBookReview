const axios = require('axios');

// Async/Await function to get books by author
async function getBooksByAuthor(author) {
    try {
        const encodedAuthor = encodeURIComponent(author);
        const response = await axios.get(`http://localhost:5000/books/author/${encodedAuthor}`);
        console.log(`=== Books by ${author} ===`);
        console.log(JSON.stringify(response.data, null, 2));
        return response.data;
    } catch (error) {
        console.error(`Error fetching books by ${author}:`, error.message);
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
        }
    }
}

// Execute the function
getBooksByAuthor('Jane Austen');