const async = require('async');
const url = require('url');


var github = require("./modules/github");
const indeed = require("./modules/indeed");
const dbpedia = require("./modules/dbpedia");
const utilities = require("./utilities");
const jobmatch = require("./modules/jobmatch");

module.exports = (function () {
    var struct = {
        analysis: analysis,
        token: null
    };

    init(struct);

    return struct;

})();

function init(self) {

    github.getAuth(function (result) {
        if (result["token"]) {
            github.token = result["token"];
            console.log(" Application successfully authenticated on GitHub API");
        }
        else {
            console.log(" An error occured during authentication on GitHub API");
        }


    });
}

function analysis(req, res) {
    var queryObject = url.parse(req.url, true).query;
    if (queryObject['username'] && queryObject['city'] && queryObject['country']) {
        gatheringData(queryObject, function (userObject, jobsObject) {
            //execution of a jobMatch
            var output = jobmatch.findMatch(userObject, jobsObject);
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(JSON.stringify(output));
        });
    }
    else {
        res.writeHead(406, {'Content-Type': 'text/plain'});
        res.end("Wrong input");
    }
}

function gatheringData(options, callFinal) {

    var userText = "";
    var userResult = null;
    var jobsResult = [];

    async.parallel([
        function (callback) {
            github.getReposList(options.username, function (reposList) {

                async.forEachOfLimit(reposList, 3, function (item1, idx1, callback1) {
                    github.getReadme(item1["full_name"], function (result, request) {
                        if (result["content"] !== undefined) {
                            var readmeText = new Buffer(result["content"], result["encoding"]).toString();

                            userText += readmeText + " ";
                        }
                        callback1();
                    });
                }, function (err1) {
                    if (err1) {
                        console.error(err1.message);
                    }
                    userText = userText.replace(/([^a-zA-Z0-9\s\n])/g, "");
                    dbpedia.requestSpotlight(userText, 0.35, function (result, request) {
                        userResult = result;
                        callback();
                    });


                });

            });
        }, function (callback) {
            indeed.prepareJobs(options.city, options.country, function (jobTable) {
                jobsResult = jobTable;
                async.forEachOfLimit(jobTable, 3, function (item, idx, callback1) {
                    item.description = item.description.replace(/([^a-zA-Z0-9\s\n])/g, "");
                    dbpedia.requestSpotlight(item.description, 0.35, function (result, request) {
                        jobTable[idx]["dbpedia"] = result;
                        callback1();
                    });
                }, function (err) {
                    callback();
                });


            });

        }
    ], function (err) {
        if (err) {
            console.error(err.message);
        }
        //execution of a final callback
        callFinal(userResult, jobsResult);
    });


}
