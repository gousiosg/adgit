const Rx = require('rx');
const http = require('http');
const config = require('config');

const requests = new Rx.Subject();
const hostname = config.get('connection.host');
const port = config.get('connection.port');

const handler = require("./app/handler.js");

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