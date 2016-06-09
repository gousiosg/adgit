const https = require('https');

module.exports = (function(){
   
    return {
        getReposList: getReposList
    };
    
});

function getReposList(username){
    var post_data = "";

    var options = {
      host: 'api.github.com',
      path: '/users/' + username + '/repos/readme',
      method: 'GET',
      headers: {
          'User-Agent': 'Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.0)'
      }
    };
    
    sendRequest(post_data, options, function(response){
        var resBody = '';
        response.on("data", function(chunk) {
            resBody += chunk;
        });
        response.on("end", function(){
            console.log(resBody); 
        });
        
    })

}

function sendRequest(data, options, responseFunc, errorFunc){
    var req = https.request(options, responseFunc);
        
    });
    
    if(errorFunc !== undefined){
        req.on('error', errorFunc);
    }
    else{
        req.on('error', function(err){
           console.log(err); 
        });
    }
//    req.write(data);
    req.end();
}    
    
    
