const async = require('async');

var github  =  require("./modules/github");
const indeed  =  require("./modules/indeed");
const dbpedia = require("./modules/dbpedia");
const utilities = require("./utilities");
const jobmatch = require("./modules/jobmatch");

module.exports = (function(){
    var struct = {
        analysis: analysis,
        token: null
    };

    init(struct);

    return struct;

})();

function init(self){

    github.getAuth(function(result){
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
    
    gatheringData({
        username: "ruby", 
        city: "Amsterdam", 
        country: "nl"
    }, function (userObject, jobsObject) {
        //execution of a jobMatch
        var output = jobmatch.findMatch(userObject, jobsObject);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(output)); 
    });

}

function gatheringData(options, callFinal){
    
    var userText = "";
    var userResult = null;
    var jobsResult = [];
    
    async.parallel([
        function (callback){
            github.getReposList(options.username, function (reposList) {
                
                async.forEachOf(reposList, function (item1, idx1, callback1) {
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
                    userText = userText.replace(/([\#\(\)\:\`])/g, "");
                    dbpedia.requestSpotlight(userText, 0.35, function (result, request) {
                        userResult = result;
                        callback();	
                    });

                                        
                });

            });
        }, function (callback){
            indeed.prepareJobs(options.city, options.country, function (jobTable) {
                jobsResult = jobTable;
                async.forEachOf(jobTable, function (item, idx, callback1) {
                    console.log(item.description);
                    console.log(":dbpediaText");
                    item.description = item.description.replace(/([\#\(\)\:\`])/g, "");
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
