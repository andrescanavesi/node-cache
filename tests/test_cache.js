const app = require("../app");
const chai = require("chai");
const chaiHttp = require("chai-http");
const assert = chai.assert;
const expect = chai.expect;
const {Cache} = require("../utils/Cache");

// Configure chai
chai.use(chaiHttp);
chai.should();

function assertNotError(err, res) {
    if (err) {
        log.error(err.message);
        assert.fail(err);
    }
}

describe("Test Cache", function() {
    this.timeout(10 * 1000); //10 seconds

    it("should cache", async () => {
        //
    });
});
