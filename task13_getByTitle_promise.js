const axios = require('axios');

// Promise-based function to get book by title
function getBookByTitle(title) {
    return new Promise((resolve, reject) => {
        const encodedTitle = encodeURIComponent(title);
        axios.get(`http://localhost:5000/books/title/${encodedTitle}`)
            .then(response => {
                console.log(`=== Book with Title: "${title}" ===`);
                console.log(JSON.stringify(response.data, null, 2));
                resolve(response.data);
            })
            .catch(error => {
                console.error(`Error fetching book with title "${title}":`, error.message);
                if (error.response) {
                    console.error('Status:', error.response.status);
                    console.error('Data:', error.response.data);
                }
                reject(error);
            });
    });
}

// Execute the function
getBookByTitle('Pride and Prejudice');