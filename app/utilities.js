const https = require('https');
const http = require('http');
const request = require('request');

module.exports = {
    requestHTTPS     : requestHTTPS,
    requestHTTP      : requestHTTP,
	getPage		     : getPage,
    dbpediaTF 	     : dbpediaTF,
	normalizeTF		 : normalizeTF,
	idf				 : idf,
	tfidf			 : tfidf,
    cosineSimilarity : cosineSimilarity
}

function getPage(fullUrl, responseFunc, errorFunc) {
	if (!errorFunc) {
		errorFunc = function (err) {
			console.log(err);
		}	
	}	
	
	request(fullUrl, function (err, res, body) {
		if (err) {
			errorFunc(err);
		}
		else {
			responseFunc(body, res);
		}

	}).end();

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
//extracts all terms and counts them, adding the resulting count to tf
function dbpediaTF(dbpediaResult) {
    var foundTerms = [];
	var tf = [];

    for (var i = 0; i < dbpediaResult.Resources.length; i++) {
        var term = dbpediaResult.Resources[i];
        foundTerms.push(term["@surfaceForm"]);
    }

    for (var i = 0; i < foundTerms.length; i++) {
        var found = false;
        for (var j = 0; j < tf.length; j++) {
            if (tf[j].term == foundTerms[i]) {
                found = true;
                tf[j].count++;
				break;
            }
        }
        if (!found)
            tf.push({ term : foundTerms[i], count : 1 });
    }
	return tf;
}

function idf(tfListAds) {
    var idfList = [];
    var termList = [];
    for (var i = 0; i < tfListAds.length; i++) {
        var curAd = tfListAds[i];
        for (var j = 0; j < curAd.length; j++) {
            var curTerm = curAd[j].term;
            var found = false;
            for (var k = 0; k < termList.length; k++) {
                if (termList[k].term == curTerm) {
                    found = true
                    termList[k].count++;
					break;
                }
            }
            if (!found)
				termList.push({ term : curTerm, count : 1 });
        }
    }
    for (var i = 0; i < termList.length; i++) {
        var idf = 1 + Math.log(tfListAds.length / termList[i].count);
		idfList.push({ term : termList[i].term, val : idf });
    }
	return idfList;
}

function normalizeTF(tf) {
	var count = 0;
	for(var i = 0; i < tf.length; i++)
		count += tf[i].count;
	for(var i = 0; i < tf.length; i++)
		tf[i].count = tf[i].count/count;
}

function tfidf(tf, idf) {
	var tfidf = [];
	for(var i = 0; i < tf.length; i++) {
		var curTerm = tf[i].term;
		var idfval = 1.0;
		for(var j = 0; j < idf.length; j++) {
			if(idf[j].term == curTerm) {
				idfval = idf[j].val;
				break;
			}
		}
		tfidf.push({ term : curTerm, tfidf : tf[i].count * idfval });
	}
	return tfidf;
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