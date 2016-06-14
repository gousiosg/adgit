const http = require("http");
const querystring = require("querystring");
const config = require("config");

module.exports = (function(){
    var struct = {
      searchJobs: searchJobs  
    };
    
    return struct;
})();

function searchJobs(query, location, callback){
    var post_data = "";
    
    var paramJSON = {
        publisher: config.get("indeed.publisher"),
        q: query,
        l: location,
        radius: config.get("indeed.radius"),
        v: config.get("indeed.v"),
        co: "nl",
        limit: config.get("indeed.limit"),
        format: "json"
    };
    
    var param = querystring.stringify(paramJSON);
    
    var options = {
        host: 'api.indeed.com',
        path: '/ads/apisearch?' + param,
        jobkeys: '',
        method: 'GET', 
        headers: {
          'User-Agent'    : 'Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.0)',
        }
    };
    
    sendRequest(post_data, options, callback);       
}

function sendRequest(data, options, responseFunc, errorFunc){
    
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