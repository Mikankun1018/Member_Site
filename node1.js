const http = require("node:http");

const hostname = "127.0.0.1";
const port = 3001;

const server = http.createServer((req, res) => {
  if (req.url === "/") {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");
    res.end("Hello, World! root\n");
  } else if (req.url === "/test") {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");
    res.end("Hello, World! root/test\n");
  } else {
    res.statusCode = 400;
    res.setHeader("Content-Type", "text/plain");
    res.end("404 Not Found\n");
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
