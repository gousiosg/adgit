const github = require("./github");

module.exports = (function(){
    init();
    
    return {
        analysis: analysis
    };
    
})(); 

function init(){
    github.requestAuth("f7959612467f83251b12", function(result){
        console.log("Requested auth:");
        console.log(result); 
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
        github.getReadme(reposList[i]["full_name"], function(result){
//            console.log("Next readme:");

            if(result["content"] !== undefined){
                console.log(result["content"]);
                console.log(result["encoding"]);
                var readmeText = Buffer.from(result["content"], "base64");
                console.log(reposList[i]["full_name"] + ": ");
                console.log(readmeText);
            }

        });
    }
    
}