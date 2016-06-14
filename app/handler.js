const github = require("./modules/github");

const indeed = require("./modules/indeed");

module.exports = (function(){
    var struct = {  
        analysis: analysis,
        isReady: false
    };
    
    init(struct);
    
    return struct;
    
})(); 

function init(self){
    
    indeed.searchJobs("software developer", "Nijmegen", function(result, request){
        console.log(result);
        console.log(request);
    })
    
    github.getAuth(function(result){
       console.log(result);
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