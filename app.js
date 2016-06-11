const Rx = require('rx');
const http = require('http');

const requests = new Rx.Subject();
const hostname = 'localhost';
const port = 3000;

const github = require("./config/github.js");
const handler = require("./config/handler.js");

requests
  .subscribe(main);

http.createServer((req, res) => {
  requests.onNext({ req: req, res: res });
}).listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

function main(e) {
    
    var handlerObject = handler.analysis(e.req, e.res);
        
}