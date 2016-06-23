var utilities = require("../utilities");

module.exports = {
	findMatch : findMatch,
	computeSimilarities : computeSimilarities
}

function findMatch(readme, jobs)
{
	readmeTF = utilities.dbpediaTF(readme);
	utilities.normalizeTF(readmeTF);
	jobTFs = [];
	for(var i = 0; i < jobs.length; i++)
	{
		jobTF = utilities.dbpediaTF(jobs[i]["dbpedia"]);
		utilities.normalizeTF(jobTF);
		jobTFs.push(jobTF);
	}
	return computeSimilarities(readmeTF, jobTFs);
}

//returns a list of cosine similarities, the closer the value is to 1 the closer the match with the query
//the index in the similarity list corresponds to the index of the ad in tfListAds
//input:
//tfQuery, a normalized wordcount of all the github user readmes thrown together
//tfListAds, a list of normalized wordcounts, each list corresponding to a single advertisement
function computeSimilarities(tfQuery, tfListAds)
{
	//compute the idf
	var idfList = utilities.idf(tfListAds);
	
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
	var tfidfQuery = utilities.tfidf(tfQuery, idfList);
	var similarities = [];
	for(var i = 0; i < tfListAdsOrdered.length; i++) {
		var tfidfAd = utilities.tfidf(tfListAdsOrdered[i], idfList);
		similarities.push(utilities.cosineSimilarity(tfidfQuery, tfidfAd));
	}
	return similarities;
}