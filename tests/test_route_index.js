const app = require("../app");
const chai = require("chai");
const chaiHttp = require("chai-http");
const assert = chai.assert;
const expect = chai.expect;
var randomstring = require("randomstring");
const {Cache} = require("../utils/Cache");
const daoUsers = require("../daos/dao_users");

// Configure chai
chai.use(chaiHttp);
chai.should();

function assertNotError(err, res) {
    if (err) {
        log.error(err.message);
        assert.fail(err);
    }
}

describe("Test index route", function() {
    this.timeout(10 * 1000); //10 seconds

    it("should get index", function(done) {
        chai.request(app)
            .get("/")
            .end(function(err, res) {
                assertNotError(err, res);
                expect(res).to.have.status(200);
                done();
            });
    });

    //TODO add more scenarios
});
