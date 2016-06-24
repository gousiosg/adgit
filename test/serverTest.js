var chai = require('chai');
var chaiHttp = require('chai-http');
chai.use(chaiHttp);

const expect = chai.expect;


describe('Test Server', function () {
    it('check the result of main request', function () {
        chai.request('http://localhost:3000/service?username=Michsior14&city=Warsaw&country=pl')
        .get('/')
        .end(function (err, res) {
            expect(err).to.be.null;
            expect(res).to.have.status(200);
        });
    });

});
