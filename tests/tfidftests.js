var chai = require('chai');
var expect = chai.expect;
var utilities = require("../app/utilities");
var dbpedia = require("../app/modules/dbpedia");

describe('dbpediaTF', function(){
	it('dbpediaTF should count all terms found by dbpedia', function(){
		dbpedia.requestSpotlight("Linux Unix Posix there are no terms here Hackers Unit Test Linux Linux Linux", 0.35, function(result, response){
			var tf = utilities.dbpediaTF(result);
			expect(tf.length).to.equal(5);
			expect(tf[0].count).to.equal(4);
		});
	});
});

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