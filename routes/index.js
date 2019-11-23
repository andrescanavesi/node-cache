var express = require("express");
var router = express.Router();

const daoUsers = require("../daos/dao_users");

router.get("/", async function(req, res, next) {
    try {
        // await daoUsers.findAll();
        // await daoUsers.findAll();
        // await daoUsers.findAll();
        await daoUsers.findById(33);
        await daoUsers.findById(25);
        await daoUsers.findById(33);
        await daoUsers.findById(25);
        await daoUsers.findById(33);
        await daoUsers.findById(25);
        //const allUsers = await daoUsers.findAll();
        const cacheStats = daoUsers.getCacheStats();
        res.json(cacheStats);
    } catch (error) {
        next(error);
    }
});

module.exports = router;
