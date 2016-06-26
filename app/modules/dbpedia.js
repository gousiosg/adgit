const querystring = require("querystring");
const config = require("config");

const utilities = require('../utilities');

module.exports = (function(){
    var struct = {
      requestSpotlight: requestSpotlight
    };

    return struct;
})();

function requestSpotlight(text, confidence, callback){

    var paramJSON = {
        confidence: confidence,
        text:       text
    };

    var post_data = querystring.stringify(paramJSON);

    var options = {
        host: 'spotlight.sztaki.hu',
        path: '/rest/annotate',
        port: 2222,
        method: 'POST',
        headers: {
          'Accept'        : 'application/json',
          'Content-Type'  : 'application/x-www-form-urlencoded',
          'Content-Length': post_data.length,
          'User-Agent'    : 'Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.0)',
        }
    };
    console.log ( 'Requesting ' + options.host+ "/" + options.path );
    utilities.requestHTTP(post_data, options, callback);
}
