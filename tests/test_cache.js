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

describe("Test Cache", function() {
    this.timeout(10 * 1000); //10 seconds

    const dummyFunc = key => {
        return "test";
    };

    describe("Test Cache constructor", function() {
        it("should not allow cache creation without name", async () => {
            try {
                new Cache(null, 1, 1, dummyFunc);
                assert.fail("Should not create a cache without name");
            } catch (e) {
                assert.isNotNull(e);
                assert.equal(e.message, "name cannot be empty");
            }
        });
        it("should not allow cache creation without duration", async () => {
            try {
                new Cache("abc", null, 1, dummyFunc);
                assert.fail("Should not create a cache without duration");
            } catch (e) {
                assert.isNotNull(e);
                assert.equal(e.message, "duration cannot be empty");
            }
        });
        it("should not allow cache creation without size", async () => {
            try {
                new Cache("abc", 1, null, dummyFunc);
                assert.fail("Should not create a cache without size");
            } catch (e) {
                assert.isNotNull(e);
                assert.equal(e.message, "size cannot be empty");
            }
        });
        it("should not allow cache creation without a function", async () => {
            try {
                new Cache("abc", 1, 1, null);
                assert.fail("Should not create a cache without a function");
            } catch (e) {
                assert.isNotNull(e);
                assert.equal(e.message, "func cannot be empty");
            }
        });
    });

    describe("Test getStats", function() {
        it("should validate stats", async () => {
            const cacheName = randomstring.generate(8);
            const cache = new Cache(cacheName, 1, 1, dummyFunc);
            const stats = cache.getStats();
            assert.isNotNull(stats);
            assert.equal(stats.name, cacheName);

            //TODO
        });
    });

    describe("Test getData", function() {
        it("should validate getData", async () => {
            const cacheName = randomstring.generate(8);
            const cache = new Cache(cacheName, 1, 1, dummyFunc);
            let data = await cache.getData(1);
            assert.isNotNull(data);

            data = cache.getData(1);
            assert.isNotNull(data);

            //TODO
        });
    });

    describe("Test cleanUp", function() {
        it("should clean up", async () => {
            const cacheName = randomstring.generate(8);
            const cache = new Cache(cacheName, 1, 1, dummyFunc);
            await cache.cleanUp();

            //TODO
        });
    });

    describe("Test isObjectExpired", function() {
        it("should reset", async () => {
            const cacheName = randomstring.generate(8);
            const cache = new Cache(cacheName, 1, 1, dummyFunc);
            await cache.isObjectExpired(1);

            await cache.isObjectExpired(undefined);
            await cache.isObjectExpired(null);
            await cache.isObjectExpired("");
            await cache.isObjectExpired(" ");
            //TODO
        });
    });

    describe("Test getFreshedData", function() {
        it("should getFreshedData", async () => {
            const cacheName = randomstring.generate(8);
            const cache = new Cache(cacheName, 1, 1, dummyFunc);
            await cache.getFreshedData(1);

            //TODO
        });
    });

    describe("Test reset", function() {
        it("should reset", async () => {
            const cacheName = randomstring.generate(8);
            const cache = new Cache(cacheName, 1, 1, dummyFunc);
            await cache.reset();

            //TODO
        });
    });
});
