const axios = require('axios');

// Async/Await function to get all books
async function getAllBooks() {
    try {
        const response = await axios.get('http://localhost:5000/books');
        console.log('=== All Books ===');
        console.log(JSON.stringify(response.data, null, 2));
        return response.data;
    } catch (error) {
        console.error('Error fetching books:', error.message);
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
        }
    }
}

// Execute the function
getAllBooks();