const https = require('https');

module.exports = (function(){
   
    return {
        requestAuth: requestAuth,
        getReposList: getReposList,
        getReadme: getReadme
        
    };
    
})();

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
          'User-Agent': 'Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.0)'
      }
    };
    
    sendRequest(post_data, options, callback);    
}

function requestAuth(clientId, callback){
//    var post_data = "client_id=" + clientId;
    var post_data = "";
    
    var options = {
      host: 'api.github.com',
      path: '/login/oauth/authorize?client_id=' + clientId,
      method: 'GET',
      headers: {
          'client_id'     : clientId,
          'User-Agent'    : 'Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.0)'
//          'Content-Type'  : 'application/x-www-form-urlencoded',
//          'Content-Length': post_data.length
      }
    };
    
    sendRequest(post_data, options, callback);       
}


function sendRequest(data, options, responseFunc, errorFunc){
    var req = https.request(options, function(response){

        var resBody = '';
        response.on("data", function(chunk) {
            resBody += chunk;
        });
        response.on("end", function(){
            result = JSON.parse(resBody);
            responseFunc(result);
            
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
    
    
