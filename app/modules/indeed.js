const querystring = require("querystring");
const config = require("config");
const async = require("async");
const cheerio = require('cheerio');

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
    console.log ( 'Requesting ' + options.path );
    utilities.requestHTTP(post_data, options, callback);
}

function prepareJobs(city, country, callback) {

	var jobTable = [];

	async.forEachOfLimit(config.get("indeed.query_table"), 1,  function (item, idx, callback0) {
		searchJobs(item, city, country, function (result, request) {
            var jobs = result['results'];
			async.forEachOf(jobs, function (item2, idx2, callback2) {
				utilities.getPage(item2['url'], function (res2, req2) {
					var jobTxt = makeJobObject(res2, item2['company'], item2['url']);
					jobTable.push(jobTxt);
					callback2();
				}, function (err3) {
					callback2(err3);
				});
			}, function (err2) {
				if (err2) {
					console.error(err2.message);
				}
				callback0();
			});

		});

	}, function (err) {
		if (err) {
			console.error(err.message);
		}
		callback(jobTable);
	});

}

function makeJobObject(html, company, url) {
    var doc = cheerio.load(html);
    var desc = doc('title').html() + ' ' + doc('#job_summary').html();

    return {
        title: doc('title').html(),
        company: company,
        url: url,
        description: desc
    };
}
