const async = require('async');

var github  =  require("./modules/github");
const indeed  =  require("./modules/indeed");
const dbpedia = require("./modules/dbpedia");
const utilities = require("./utilities");

module.exports = (function(){
    var struct = {
        analysis: analysis,
        token: null
    };

    init(struct);

    return struct;

})();

function init(self){

<<<<<<< HEAD
//    indeed.searchJobs("software developer", "Nijmegen", function(result, request){
//        console.log(result);
//        console.log(request);
//    });

    /*dbpedia.requestSpotlight("Linux is a clone of the operating system Unix, written from scratch by" +
  "Linus Torvalds with assistance from a loosely-knit team of hackers across" +
  "the Net. It aims towards POSIX and Single UNIX Specification compliance." +
  "It has all the features you would expect in a modern fully-fledged Unix," +
  "including true multitasking, virtual memory, shared libraries, demand "+
  "loading, shared copy-on-write executables, proper memory management, "+
  "and multistack networking including IPv4 and IPv6. " +
  "It is distributed under the GNU General Public License - see the"+
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
		console.log(utilities.findBestMatch(query, test));
    });*/
=======
  //  dbpedia.requestSpotlight("Linux is a clone of the operating system Unix, written from scratch by" +
  //"Linus Torvalds with assistance from a loosely-knit team of hackers across" +
  //"the Net. It aims towards POSIX and Single UNIX Specification compliance." +
  //"It has all the features you would expect in a modern fully-fledged Unix," +
  //"including true multitasking, virtual memory, shared libraries, demand "+
  //"loading, shared copy-on-write executables, proper memory management, "+
  //"and multistack networking including IPv4 and IPv6. " +
  //"It is distributed under the GNU General Public License - see the "+
  //"accompanying COPYING file for more details.", 0.35, function(result, response){
  //      var dbptf = [];
		//utilities.dbpediaTF(result, dbptf);
		//utilities.normalizeTF(dbptf);
		//var test = [];
		//test.push(dbptf);
		//testcount = [];
		//testcount.push({ term : 'Unix', count : 2});
		//testcount.push({ term : 'Linux', count: 1});
		//testcount.push({ term : 'Test', count: 2});
		//utilities.normalizeTF(testcount);
		//test.push(testcount);
		//testcount2 = [];
		//testcount2.push({ term : 'Unix', count: 5});
		//testcount2.push({ term : 'Testing', count : 1});
		//utilities.normalizeTF(testcount2);
		//test.push(testcount2);
		//query = [];
		//query.push({ term : 'Unix', count: 5});
		//query.push({ term : 'Test', count: 5});
		//utilities.normalizeTF(query);
		//console.log(utilities.findBestMatch(query, test));
  //  });

    github.getAuth(function(result){
        if (result["token"]) {
            github.token = result["token"];
            console.log(" Application successfully authenticated on GitHub API");
        }
        else {
            console.log(" An error occured during authentication on GitHub API");
        }
       
       
   });
>>>>>>> origin/development



}

function analysis(req, res){
    

    //github.getReposList("Michsior14", function (result) {
    //    getReadmes(result);
    //    res.writeHead(200, { 'Content-Type': 'text/plain' });
    //    res.end(JSON.stringify(result));

    //});
    level1("Michsior14", "Amsterdam", "nl");


}

function level1(username, city, country){
    
    var counter = 0;
    var userText = "";
    
    async.parallel([
        function (callback){
            github.getReposList(username, function (reposList) {
                
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
                    //console.log("userText:");
                    //console.log(userText);
                    dbpedia.requestSpotlight(userText, 0.35, function (result, request) {
                        
                    });

                    callback();	                    
                });

            });
        }, function (callback){
            indeed.prepareJobs(city, country, function (jobTable) {
                
                               
                callback();
            });

        }
    ], function (err) {
        if (err) {
            console.error(err.message);
        }    
    
    });



}


function getReadmes(reposList){

    for(var i = 0; i < reposList.length; i++){
        github.getReadme(reposList[i]["full_name"], function(result, request){

            if(result["content"] !== undefined){
                console.log("Readme req");
                console.log(reposList);
                var readmeText = new Buffer(result["content"], result["encoding"]);
//                console.log(reposList[i]["full_name"] + ": ");
                console.log(readmeText);
            }

        });
    }

}