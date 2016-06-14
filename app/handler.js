const github  =  require("./modules/github");
const indeed  =  require("./modules/indeed");
const dbpedia = require("./modules/dbpedia");

module.exports = (function(){
    var struct = {  
        analysis: analysis,
        isReady: false
    };
    
    init(struct);
    
    return struct;
    
})(); 

function init(self){
    
//    indeed.searchJobs("software developer", "Nijmegen", function(result, request){
//        console.log(result);
//        console.log(request);
//    });
    
    dbpedia.requestSpotlight("Linux is a clone of the operating system Unix, written from scratch by" +
  "Linus Torvalds with assistance from a loosely-knit team of hackers across" +
  "the Net. It aims towards POSIX and Single UNIX Specification compliance." +
  "It has all the features you would expect in a modern fully-fledged Unix," +
  "including true multitasking, virtual memory, shared libraries, demand "+
  "loading, shared copy-on-write executables, proper memory management, "+
  "and multistack networking including IPv4 and IPv6. " +
  "It is distributed under the GNU General Public License - see the"+
  "accompanying COPYING file for more details.", 0.35, function(result, response){
        console.log(result);
    });
    
    github.getAuth(function(result){
//       console.log(result);
       github.token = result["token"];
       self.isReady = true;
    });
    
}

function analysis(req, res){
        
    github.getReposList("Michsior14", function(result){
        getReadmes(result);
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end(JSON.stringify(result));
        
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