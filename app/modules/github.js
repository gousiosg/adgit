const config = require('config');

const utilities = require('../utilities');

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
    requestAuth(callback);
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
    
    if(this.token !== null){
        options["headers"]["X-Shopify-Access-Token"] = this.token;
    }
    
    utilities.requestHTTPS(post_data, options, callback);

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
    
    if(this.token !== null){
        options["headers"]["X-Shopify-Access-Token"] = this.token;
    }
    
    utilities.requestHTTPS(post_data, options, callback);    
}

function requestAuth(callback){
    var post_data = { 
        "scopes": [ "public_repo"],
        "note": "admin script",
        "client_id" : config.get('github.client_id'),
        "client_secret": config.get('github.client_secret')
    };
    post_data = JSON.stringify(post_data);
    
    var username = config.get('github.username');
    var password = config.get('github.password');
    
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
    
    utilities.requestHTTPS(post_data, options, callback);       
}


    
    
