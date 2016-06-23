var chai = require('chai');
var expect = chai.expect;
var utilities = require("../app/utilities");
var dbpedia = require("../app/modules/dbpedia");



describe('normalizeTF', function() {
	it('normalize should normalize a TF list', function(){
		var tf = [
		{
			term: 'linux',
			count: 4
		},
		{
			term: 'Unix',
			count: 2
		},
		{
			term: 'Test',
			count: 1
		}
		];
		utilities.normalizeTF(tf);
		expect(tf[0].count).to.equal(4/7);
		expect(tf[1].count).to.equal(2/7);
		expect(tf[2].count).to.equal(1/7);
	});
});

describe('idf', function() {
	it('Inverse document frequency should weigh terms closer to 1 if it appears in more documents', function() {
		var docs = [];
		var doc1 = [
		{
			term: 'linux',
			count: 1
		}];
		var doc2 = [
		{
			term: 'linux',
			count: 2
		},
		{
			term: 'unix',
			count: 1
		}];
		var doc3 = [
		{
			term: 'linux',
			count: 3
		},
		{
			term: 'unix',
			count: 2
		},
		{
			term: 'Test',
			count: 1
		}];
		docs.push(doc1); docs.push(doc2); docs.push(doc3);
		var idf = utilities.idf(docs);
		expect(idf[0].val).to.equal(1);
		expect(idf[1].val > idf[0].val).to.equal(true);
		expect(idf[2].val > idf[1].val).to.equal(true);
	});
});