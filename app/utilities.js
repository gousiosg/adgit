const https = require('https');
const http = require('http');

module.exports = {
    requestHTTPS : requestHTTPS,
    requestHTTP  : requestHTTP,
    dbpediaWordCount : dbpediaWordCount,
    cosineSimilarity : cosineSimilarity
}

function requestHTTPS(data, options, responseFunc, errorFunc){

    var req = https.request(options, function(response){

        var resBody = '';
        response.on("data", function(chunk) {
            resBody += chunk;
        });
        response.on("end", function(){
            result = JSON.parse(resBody);
            responseFunc(result, options);

        });
    });

    if(errorFunc !== undefined){
        req.on('error', errorFunc);
    }
    else{
        req.on('error', function(err){
           console.log(err);
        });
    }
    req.write(data);
    req.end();
}


function requestHTTP(data, options, responseFunc, errorFunc){

    var req = http.request(options, function(response){

        var resBody = '';
        response.on("data", function(chunk) {
            resBody += chunk;
        });
        response.on("end", function(){
            result = JSON.parse(resBody);
            responseFunc(result, options);

        });
    });

    if(errorFunc !== undefined){
        req.on('error', errorFunc);
    }
    else{
        req.on('error', function(err){
           console.log(err);
        });
    }
    req.write(data);
    req.end();
}

//takes a json result from a dbpedia query
//extracts all terms and counts them
function dbpediaWordCount(dbpediaResult) {
    var termCountList = [];
    var foundTerms = [];

    for (var i = 0; i < dbpediaResult.Resources.length; i++) {
        var term = dbpediaResult.Resources[i];
        foundTerms.push(term["@surfaceForm"]);
    }

    for (var i = 0; i < foundTerms.length; i++) {
        var found = false;
        for (var j = 0; j < termCountList.length; j++) {
            if (termCountList[j].term == foundTerms[i]) {
                found = true;
                termCountList[j].count++;
            }
        }
        if (!found)
            termCountList.push({ term : foundTerms[i], count : 1 });
    }
    return termCountList;
}

//calculates the cosine similarity of 2 vectors,
//return value will approach 1 as similarity increases
function cosineSimilarity(vec1, vec2) {
    var dotproduct = 0, sum1 = 0, sum2 = 0;
    for (var i = 0; i < vec1.length; i++) {
        dotproduct += vec1[i] * vec2[i];
        sum1 += vec1[i] * vec1[i];
        sum2 += vec2[i] * vec2[i];
    }
    var mag1 = Math.sqrt(sum1);
    var mag2 = Math.sqrt(sum2);
    return (dotproduct / (mag1 * mag2));
}