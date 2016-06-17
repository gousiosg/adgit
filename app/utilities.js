const https = require('https');
const http = require('http');
const request = require('request');

module.exports = {
    requestHTTPS     : requestHTTPS,
    requestHTTP      : requestHTTP,
	getPage		     : getPage,
    dbpediaTF 	     : dbpediaTF,
	normalizeTF		 : normalizeTF,
	findBestMatch    : findBestMatch,
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
function dbpediaTF(dbpediaResult, tf) {
    var foundTerms = [];

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

//returns a list of cosine similarities, the closer the value is to 1 the closer the match with the query
//the index in the similarity list corresponds to the index of the ad in tfListAds
//input:
//tfQuery, a normalized wordcount of all the github user readmes thrown together
//tfListAds, a list of normalized wordcounts, each list corresponding to a single advertisement
function findBestMatch(tfQuery, tfListAds)
{
	//compute the idf
	var idfList = idf(tfListAds);
	
	//remove all terms from the ad tfs that do not appear in the query and order them like the query
	var tfListAdsOrdered = [];
	for(var i = 0; i < tfListAds.length; i++) {
		var curAd = tfListAds[i];
		var orderedAd = [];
		for(var j = 0; j < tfQuery.length; j++) {
			for(var k = 0; k < curAd.length; k++) {
				if(curAd[k].term == tfQuery[j].term) {
					orderedAd.push({ term : curAd[k].term, count : curAd[k].count });
					break;
				}
				if(k == curAd.length-1)
					orderedAd.push({ term : tfQuery[j].term, count : 0 });
			}
		}
		tfListAdsOrdered.push(orderedAd);
	}
	
	//create and return the list of similarities
	var tfidfQuery = tfidf(tfQuery, idfList);
	var similarities = [];
	for(var i = 0; i < tfListAdsOrdered.length; i++) {
		var tfidfAd = tfidf(tfListAdsOrdered[i], idfList);
		similarities.push(cosineSimilarity(tfidfQuery, tfidfAd));
	}
	return similarities;
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