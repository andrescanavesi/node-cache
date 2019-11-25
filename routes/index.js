var express = require("express");
var router = express.Router();

const daoUsers = require("../daos/dao_users");

router.get("/", async function(req, res, next) {
    try {
        daoUsers.seed();
        // await daoUsers.findAll();
        // await daoUsers.findAll();
        // await daoUsers.findAll();
        await daoUsers.findById(1);
        await daoUsers.findById(2);
        await daoUsers.findById(1);
        await daoUsers.findById(2);
        await daoUsers.findById(2);
        await daoUsers.findById(444);
        await daoUsers.findById(444);
        await daoUsers.findById(444);
        //const allUsers = await daoUsers.findAll();
        const cacheStats = daoUsers.getCacheStats(true);
        res.json(cacheStats);
    } catch (error) {
        next(error);
    }
});

module.exports = router;
