const fs = require('fs');

module.exports = {
    getFile: getFile
};

function getFile(req, res){

    console.log("inside getFile");
    var fileAddr = req.url;
    if(fileAddr.indexOf('?') > -1){
        fileAddr = fileAddr.substring(0, fileAddr.indexOf('?'));
    }
    if(fileAddr.indexOf('?') > -1){
        fileAddr = fileAddr.substring(fileAddr.indexOf('/client') + 1);
    }

    console.log(fileAddr);
    fs.readFile(__dirname + fileAddr, function(err, file){
        if (err){
            console.log(err);
            res.writeHead(404);
            res.end();
        }
        else{
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(file);
            res.end();
        }

    });
}