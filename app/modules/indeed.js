const querystring = require("querystring");
const config = require("config");
const async = require("async");

const utilities = require('../utilities');

module.exports = (function(){
    var struct = {
		searchJobs: searchJobs,
		prepareJobs: prepareJobs  
    };
    
    return struct;
})();

function searchJobs(query, city, country, callback){
    var post_data = "";
    
    var paramJSON = {
        publisher: config.get("indeed.publisher"),
        q: query,
        l: city,
        radius: config.get("indeed.radius"),
        v: config.get("indeed.v"),
        co: country,
        limit: config.get("indeed.limit"),
        format: "json"
    };
    
    var param = querystring.stringify(paramJSON);
    
    var options = {
        host: 'api.indeed.com',
        path: '/ads/apisearch?' + param,
        method: 'GET', 
        headers: {
          'User-Agent'    : 'Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.0)',
        }
    };
    
    utilities.requestHTTP(post_data, options, callback);       
}

function prepareJobs(city, country) {
	
	var jobTable = [];
	
	async.forEachOf(config.get("indeed.query_table"), function (item, idx, callback) {
		searchJobs(item, "Nijmegen", "nl", function (result, request) {
			jobTable = jobTable.concat(result['results']);
			var jobs = result['results'];
			for (var i = 0; i < jobs.length; i++) {
				utilities.getPage(jobs[i]['url'], function (res2, req2) {
					console.log(res2);
				});
			}
			
			callback();
		});
        
	}, function (err) {
		if (err) {
			console.error(err.message);
		}
		//console.log("jobTable: ");
		//console.log(jobTable);
	});
    
}