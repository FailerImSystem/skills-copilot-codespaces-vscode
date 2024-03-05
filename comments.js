// Create web server
// 1. create a server
// 2. listen for requests
// 3. respond to requests
// 4. parse the request
// 5. create a response
// 6. send the response
// 7. handle errors

// import the http module
const http = require('http');
const fs = require('fs');
const url = require('url');
const path = require('path');

// import the comments module
const comments = require('./comments');

// define the port
const port = 3000;

// create a server
const server = http.createServer((req, res) => {
    // parse the request
    const parsedUrl = url.parse(req.url, true);
    const path = parsedUrl.pathname;
    const query = parsedUrl.query;

    // create a response
    res.writeHead(200, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
    });

    // handle errors
    req.on('error', (err) => {
        console.error(err);
        res.writeHead(400, {
            'Content-Type': 'application/json'
        });
        res.end(JSON.stringify({error: 'Error parsing request'}));
    });

    res.on('error', (err) => {
        console.error(err);
    });

    // respond to requests
    if (req.method === 'GET') {
        if (path === '/comments') {
            res.end(JSON.stringify(comments.getComments()));
        } else {
            res.end(JSON.stringify({error: 'Invalid endpoint'}));
        }
    } else if (req.method === 'POST') {
        if (path === '/comments') {
            let body = [];
            req.on('data', (chunk) => {
                body.push(chunk);
            }).on('end', () => {
                body = Buffer.concat(body).toString();
                comments.addComment(JSON.parse(body).comment);
                res.end(JSON.stringify(comments.getComments()));
            });
        } else {
            res.end(JSON.stringify({error: 'Invalid endpoint'}));
        }
    } else {
        res.end(JSON.stringify({error: 'Invalid request method'}));
    }
});

// listen for requests
server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});