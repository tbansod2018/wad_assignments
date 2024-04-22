const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
    // Parse requested URL
    const parsedUrl = url.parse(req.url);
    // Get the path from the URL
    let filePath = path.join(__dirname, 'public', parsedUrl.pathname);

    // Set default file path to index.html if no file specified
    if (filePath == path.join(__dirname, 'public', '/')) {
        filePath = path.join(__dirname, 'public', 'index.html');
    }

    // Check if the requested file exists
    fs.exists(filePath, (exists) => {
        if (exists) {
            // Read the file
            fs.readFile(filePath, (err, data) => {
                if (err) {
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    res.end('Internal Server Error');
                } else {
                    // Determine the content type based on file extension
                    const contentType = getContentType(filePath);
                    res.writeHead(200, { 'Content-Type': contentType });
                    // Send the file content to the client
                    res.end(data);
                }
            });
        } else {
            // If the file does not exist, return a 404 error
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('404 Not Found');
        }
    });
});

// Function to determine content type based on file extension
function getContentType(filePath) {
    const extname = path.extname(filePath);
    switch (extname) {
        case '.html':
            return 'text/html';
        case '.css':
            return 'text/css';
        case '.js':
            return 'text/javascript';
        case '.json':
            return 'application/json';
        case '.png':
            return 'image/png';
        case '.jpg':
            return 'image/jpg';
        default:
            return 'application/octet-stream';
    }
}

// Set the port for the server to listen on
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
