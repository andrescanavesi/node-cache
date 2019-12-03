const {Cache} = require("../utils/Cache");

//our datasource. In real life this connection will be a database
const allUsers = [];
/**
 * Creates some users for our allUsers collection
 */
module.exports.seed = function() {
    for (let i = 0; i < 10; i++) {
        allUsers.push({id: i, name: "user" + i});
    }
};

const cacheAllUsers = new Cache("all users", 1000 * 5, 20, key => {
    return "Im cache all users func with the key: " + key;
});

const cacheUserById = new Cache("user by id", 1000 * 5, 30, userId => {
    let i = 0;
    do {
        if (allUsers[i].id === userId) {
            return allUsers[i];
        }
        i++;
    } while (i < allUsers.length);

    return null;
});

/**
 *
 */
module.exports.findAll = async function() {
    //console.info(cacheAllUsers.getStats());
    return cacheAllUsers.getData(1);
};

/**
 * @param {number} id
 */
module.exports.findById = async function(id) {
    return cacheUserById.getData(id);
};

/**
 * @returns an array containing all caches stats
 */
module.exports.getCacheStats = function(showContent) {
    return [cacheUserById.getStats(showContent), cacheAllUsers.getStats(showContent)];
};
