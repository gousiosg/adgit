const github = require("./github");

module.exports = (function(){
    var struct = {  
        analysis: analysis,
        isReady: false
    };
    
    init(struct);
    
    return struct;
    
})(); 

function init(self){
    github.getAuth(function(result){
       github.token = result["token"];
       self.isReady = true;
    });
    
}

function analysis(req, res){
    console.log("Starting handler");
    
    
    github.getReposList("Michsior14", function(result){
        getReadmes(result);
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