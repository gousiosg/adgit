const Rx = require('rx');
const http = require('http');
const config = require('config');

const requests = new Rx.Subject();
const hostname = config.get('connection.host');
const port = config.get('connection.port');

const handlerApp = require("./app/handler");
const handlerClient = require("./client/handler");

requests
  .subscribe(main);

http.createServer((req, res) => {
  requests.onNext({ req: req, res: res });
}).listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

function main(e) {
    if(e.req.url.indexOf('/client') > -1){
        handlerClient.getFile(e.req, e.res);
    }
    else{
        handlerApp.analysis(e.req, e.res);
    }

        
}