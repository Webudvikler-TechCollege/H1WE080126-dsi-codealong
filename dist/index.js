import http from 'http';
const port = 4040;
const server = http.createServer((request, response) => {
    response.writeHead(200, { 'Content-Type': 'text/plain' }),
        response.end('Hello world!');
    console.log('Server responded');
});
server.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}`);
});
