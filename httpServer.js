
import http from 'http';
import fs from 'fs';

let books = [
    { id: 1, title: 'JavaScript', author: 'John', price: 300 },
    { id: 2, title: 'Node.js', author: 'David', price: 400 },
    { id: 3, title: 'Python', author: 'James', price: 350 }
];

const server = http.createServer((req, res) => {

    // GET /
    if (req.method === 'GET' && req.url === '/') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end('<h1>Welcome to Library Management System</h1>');
    }

    // GET /books
    else if (req.method === 'GET' && req.url === '/books') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(books));
    }

    // POST /add-book
    else if (req.method === 'POST' && req.url === '/add-book') {

        let body = '';

        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            try {
                const book = JSON.parse(body);

                if (
                    book.id === undefined ||
                    !book.title?.trim() ||
                    !book.author?.trim() ||
                    book.price === undefined ||
                    book.price === null
                ) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: 'All book details are required' }));
                    return;
                }

                books.push(book);

                res.writeHead(201, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    message: 'Book added successfully',
                    book: book
                }));

            } catch (error) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Invalid JSON data' }));
            }
        });
    }

    // GET /about
    else if (req.method === 'GET' && req.url === '/about') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end('<h1>About Library</h1><p>Library Book Management Application</p>');
    }

    // GET /home using FS module
    else if (req.method === 'GET' && req.url === '/home') {

        fs.readFile('./public/index.html', (err, data) => {

            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Error reading HTML file');
            }
            else {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(data);
            }
        });
    }

    // 404 Error
    else {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('<h1>404 Page Not Found</h1>');
    }

});

server.listen(3000, () => {
    console.log('HTTP Server running at http://localhost:3000');
});
