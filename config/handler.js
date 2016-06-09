const async = require("async");

const github = require("./github");

module.exports = handler;

function handler(req, res){
    console.log("Starting handler");
    
    var gh = new github();
    gh.getReposList("MKMZ", function(result){
        result.forEach(function(item){
           console.log(item["full_name"]); 
        });
        res.end(JSON.stringify(result));
    });
    
    
}