const https = require('https');
const http = require('http');
const request = require('request');

module.exports = {
    requestHTTPS : requestHTTPS,
	requestHTTP  : requestHTTP,
	getPage		 : getPage
}

function getPage(fullUrl, responseFunc, errorFunc) {
	if (errorFunc === undefined) {
		errorFunc = function (err) {
			console.log(err);
		}	
	}	
	
	request(fullUrl, function (err, res, body) {
		if (err !== null) {
			errorFunc(err);
		}
		else {
			responseFunc(body, res);
		}

	});
	
}

function requestHTTPS(data, options, responseFunc, errorFunc){
    
    var req = https.request(options, function(response){

        var resBody = '';
        response.on("data", function(chunk) {
            resBody += chunk;
        });
        response.on("end", function(){
            result = JSON.parse(resBody);
            responseFunc(result, options);
            
        });
    });
    
    if(errorFunc !== undefined){
        req.on('error', errorFunc);
    }
    else{
        req.on('error', function(err){    
           console.log(err); 
        });
    }
    req.write(data);
    req.end();
}    


function requestHTTP(data, options, responseFunc, errorFunc){
    
    var req = http.request(options, function(response){

        var resBody = '';
        response.on("data", function(chunk) {
            resBody += chunk;
        });
        response.on("end", function(){
            result = JSON.parse(resBody);
            responseFunc(result, options);
            
        });
    });
    
    if(errorFunc !== undefined){
        req.on('error', errorFunc);
    }
    else{
        req.on('error', function(err){    
           console.log(err); 
        });
    }
    req.write(data);
    req.end();
}    