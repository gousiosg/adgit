const https = require('https');

module.exports = (function(){
    var struct = {};
    
    this.getAuth = getAuth;
    this.getReposList = getReposList;
    this.getReadme = getReadme;
    this.getAuth = getAuth;
    this.token = null;
    
    return this;
    
})();

function getAuth(callback){
    var that = this;
    requestAuth("f7959612467f83251b12", "a61692d8e35adfb15f5b4989ead0fcc947073c20", callback);
}

function getReposList(username, callback){
    var post_data = "";
    
    var options = {
      host: 'api.github.com',
      path: '/users/' + username + '/repos',
      method: 'GET',
      headers: {
          'User-Agent': 'Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.0)'
      }
    };
    
    sendRequest(post_data, options, callback);

}

function getReadme(fullName, callback){
    var post_data = "";
    
    var options = {
      host: 'api.github.com',
      path: '/repos/' + fullName + '/readme',
      method: 'GET',
      headers: {
          'X-Shopify-Access-Token': this.token,          
          'User-Agent': 'Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.0)'
      }
    };
    
    sendRequest(post_data, options, callback);    
}

function requestAuth(clientId, clientSecret, callback){
    var post_data = { 
        "scopes": [ "public_repo"],
        "note": "admin script",
        "client_id" : clientId,
        "client_secret": clientSecret
    };
    post_data = JSON.stringify(post_data);
    
    var username = "MKMZ";
    var password = "LubieKoty666";
    
    var basic_auth = username + ":" + password;
    
    var options = {
      host: 'api.github.com',
      path: '/authorizations',
      method: 'POST', 
      auth:  basic_auth,
        headers: {
          "Accept"        : "application/vnd.github+json",
          'User-Agent'    : 'Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.0)',
          'Content-Type'  : 'application/json',
          'Content-Length': post_data.length
      }
    };
    
    sendRequest(post_data, options, callback);       
}

function sendRequest(data, options, responseFunc, errorFunc){
    console.log(this.token);
    if(this.token !== null){
        options["headers"]["X-Shopify-Access-Token"] = this.token;
    }
    
//    console.log("Sending request:");
//    console.log(options);
    
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
    
    
