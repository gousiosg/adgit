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


    /*dbpedia.requestSpotlight("Linux is a clone of the operating system Unix, written from scratch by" +
  "Linus Torvalds with assistance from a loosely-knit team of hackers across" +
  "the Net. It aims towards POSIX and Single UNIX Specification compliance." +
  "It has all the features you would expect in a modern fully-fledged Unix," +
  "including true multitasking, virtual memory, shared libraries, demand "+
  "loading, shared copy-on-write executables, proper memory management, "+
  "and multistack networking including IPv4 and IPv6. " +
  "It is distributed under the GNU General Public License - see the "+
  "accompanying COPYING file for more details.", 0.35, function(result, response){
        var dbptf = utilities.dbpediaTF(result);
		utilities.normalizeTF(dbptf);
		var test = [];
		test.push(dbptf);
		testcount = [];
		testcount.push({ term : 'Unix', count : 2});
		testcount.push({ term : 'Linux', count: 1});
		testcount.push({ term : 'Test', count: 2});
		utilities.normalizeTF(testcount);
		test.push(testcount);
		testcount2 = [];
		testcount2.push({ term : 'Unix', count: 5});
		testcount2.push({ term : 'Testing', count : 1});
		utilities.normalizeTF(testcount2);
		test.push(testcount2);
		query = [];
		query.push({ term : 'Unix', count: 5});
		query.push({ term : 'Test', count: 5});
		utilities.normalizeTF(query);
		console.log(jobmatch.computeSimilarities(query, test));
    });*/

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
        username: "tiwai", 
        city: "Amsterdam", 
        country: "nl"
    }, function (userObject, jobsObject) {
        //execution of a jobMatch
        var similarities = jobmatch.findMatch(userObject, jobsObject);
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end(similarities.toString()); 
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
                            var readmeText = new Buffer(result["content"], result["encoding"]).toString('ascii');
                            
                            userText += readmeText + " ";     
                        }
                        callback1();
                    });
                }, function (err1) {
                    if (err1) {
                        console.error(err1.message);
                    }
                    console.log(userText);
                    console.log(":userText");
                    dbpedia.requestSpotlight(userText, 0.35, function (result, request) {
                        userResult = result;
                    });

                    callback();	                    
                });

            });
        }, function (callback){
            indeed.prepareJobs(options.city, options.country, function (jobTable) {
                jobsResult = jobTable;
                async.forEachOf(jobTable, function (item, idx, callback1) {
                    //console.log(item.description);
                    //console.log(":dbpediaText");
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
