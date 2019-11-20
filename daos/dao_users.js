const {Cache} = require("../utils/Cache");

//our datasource. In real life this connection will be a database
const allUsers = [];
/**
 * Creates some users for our allUsers collection
 */
function seed() {
    for (let i = 0; i < 10; i++) {
        allUsers.push({id: i, name: "user" + i});
    }
}
seed();

const cacheAllUsers = new Cache("all users", 5, key => {
    return "Im cache all users func with the key: " + key;
    //throw new Error("im an error");
});

const cacheUserById = new Cache("user by id", 5, key => {
    return "Im cache user by id func with the key: " + key;
    //throw new Error("im an error");
});

module.exports.findAll = async function() {
    console.info(cacheAllUsers.getStats());
    return cacheAllUsers.getData(1);
};

module.exports.findById = async function(id) {
    console.info(cacheUserById.getStats());
    return cacheUserById.getData(id);
};