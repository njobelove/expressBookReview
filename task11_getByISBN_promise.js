const axios = require('axios');

// Promise-based function to get book by ISBN
function getBookByISBN(isbn) {
    return new Promise((resolve, reject) => {
        axios.get(`http://localhost:5000/books/${isbn}`)
            .then(response => {
                console.log(`=== Book with ISBN: ${isbn} ===`);
                console.log(JSON.stringify(response.data, null, 2));
                resolve(response.data);
            })
            .catch(error => {
                console.error(`Error fetching book with ISBN ${isbn}:`, error.message);
                if (error.response) {
                    console.error('Status:', error.response.status);
                    console.error('Data:', error.response.data);
                }
                reject(error);
            });
    });
}

// Execute the function
getBookByISBN('9780141439518');