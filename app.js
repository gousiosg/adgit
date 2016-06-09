const Rx = require('rx');
const http = require('http');

const requests = new Rx.Subject();
const hostname = 'localhost';
const port = 3000;

const github = require("./config/github.js");
const handler = require("./config/handler.js");

requests
  .subscribe(handlerRequest)

http.createServer((req, res) => {
  requests.onNext({ req: req, res: res });
}).listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

function handlerRequest(e) {
//    console.log('handling Request: ' + e.req.url);
    e.res.writeHead(200, { 'Content-Type': 'text/plain' });
//    e.res.end('Request received.\n');
    
    var handlerObject = new handler(e.req, e.res);
    
}