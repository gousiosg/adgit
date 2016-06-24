const chai = require('chai');
const expect = chai.expect;

const dbpedia = require("../app/modules/dbpedia");
var utilities = require("../app/utilities");

describe('Test Suite DBPedia', function () {
    it('dbpedia request - simple test', function () {
        dbpedia.requestSpotlight("Linux is a clone of the operating system Unix, written from scratch by" +
 -"Linus Torvalds with assistance from a loosely-knit team of hackers across" +
 -"the Net. It aims towards POSIX and Single UNIX Specification compliance." +
 -"It has all the features you would expect in a modern fully-fledged Unix," +
 -"including true multitasking, virtual memory, shared libraries, demand " +
 -"loading, shared copy-on-write executables, proper memory management, " +
 -"and multistack networking including IPv4 and IPv6. " +
 -"It is distributed under the GNU General Public License - see the " +
 -"accompanying COPYING file for more details.", 0.35, function (result) {
            expect(result).to.have.property('Resources');
            expect(result).to.not.have.property('asdasdasdasdasdads');
        });
    });

    it('dbpediaTF should count all terms found by dbpedia', function () {
        dbpedia.requestSpotlight("Linux Unix Posix there are no terms here Hackers Unit Test Linux Linux Linux", 0.35, function (result, response) {
            var tf = utilities.dbpediaTF(result);
            expect(tf).to.be.an('array');
            expect(tf[0]).to.have.property('term');
            expect(tf[0]).to.have.property('count');

            expect(tf.length).to.equal(5);
            expect(tf[0].count).to.equal(4);
        });
    });

    it('dbpediaTF should count more complex phrases', function () {
        dbpedia.requestSpotlight("World of Warcraft asdasdsda Solaris asdasd World of a Warcraft asdad Solaris asdasd Solaris", 0.35, function (result, response) {
            var tf = utilities.dbpediaTF(result);
            expect(tf.length).to.equal(2);
            var flag = false;
            for (var i = 0; i < tf.length; i++) {
                if (tf[i].term == "Warcraft") {
                    flag = true;
                    break;
                }
            }
            expect(flag).to.equal(true);
            
            flag = false;
            for (var i = 0; i < tf.length; i++) {
                if (tf[i].term == "Solaris") {
                    flag = true;
                    break;
                }
            }
            expect(flag).to.equal(true);
        });
    });
});

