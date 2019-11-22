/**
 * A collection to keep our promises with the cached data.
 * key: a primitive or an dobject to identify our cached object
 * value: {created_at: <a date>, promise: <the promise>}
 */
let promisesMap = new Map();
/**
 * Millis of the lates cache clean up
 */
let latestCleanUp = Date.now();

/**
 * @param name a name to identify this cache, example "find all users cache"
 * @param duration cache duration in millis
 * @param size max quantity of elements to cache. After that the cache will remove the oldest element
 * @param func the function to execute (our heavy operation)
 */
module.exports.Cache = function(name, duration, size, func) {
    //TODO validate parameters
    this.name = name;
    this.duration = duration;
    this.size = size;
    this.func = func;
};

/**
 * @returns
 */
this.Cache.prototype.getStats = function() {
    const stats = {
        cache_name: this.name,
        size: promisesMap.size,
    };
    return stats;
};

/**
 * @param {*} key
 */
this.Cache.prototype.getData = function(key) {
    if (promisesMap.has(key)) {
        console.info(`[${this.name}] Returning cache for the key: ${key}`);
        /*
         * We have to see if our cached objects did not expire.
         * If expired we have to get freshed data
         */
        if (this.isObjectExpired(key)) {
            return this.getFreshedData(key);
        } else {
            return promisesMap.get(key).promise;
        }
    } else {
        return this.getFreshedData(key);
    }
};

/**
 *
 * @param {*} key
 * @returns a promise with the execution result of our cache function (func attribute)
 */
this.Cache.prototype.getFreshedData = function(key) {
    console.info(`[${this.name}] Processing data for the key: ${key}`);
    const promise = new Promise((resolve, reject) => {
        try {
            resolve(this.func(key));
        } catch (error) {
            reject(error);
        }
    });
    const cacheElem = {
        created_at: Date.now(),
        promise: promise,
    };

    this.cleanUp();
    promisesMap.set(key, cacheElem);
    return promise;
};

/**
 * @param {*} key
 */
this.Cache.prototype.isObjectExpired = function(key) {
    if (!promisesMap.has(key)) {
        return false;
    } else {
        const object = promisesMap.get(key);
        const diff = Date.now() - object.created_at;
        return diff > this.duration;
    }
};
/**
 * Removes the expired objects and the oldest if the cache is full
 */
this.Cache.prototype.cleanUp = async function() {
    /**
     * We have to see if we have enough space
     */
    if (promisesMap.size >= this.size || Date.now() - latestCleanUp > this.duration) {
        let oldest = Date.now();
        let oldestKey = null;
        //iterate the map to remove the expired objects and calculate the oldest objects to
        //be removed in case the cache is full after removing expired objects
        for (let [key, value] of promisesMap) {
            if (this.isObjectExpired(key)) {
                console.info(`the key ${key} is expired and will be deleted form the cache`);
                promisesMap.delete(key);
            } else if (value.created_at < oldest) {
                oldest = value.created_at;
                oldestKey = key;
            }
            console.log(`m[${key}] = ${value.created_at}`);
        }

        //if after this clean up our cache is still full we delete the oldest
        if (promisesMap.size >= this.size && oldestKey !== null) {
            console.info(`the oldest element with the key ${oldestKey} in the cache was deleted`);
            promisesMap.delete(oldestKey);
        }
    } else {
        console.info("[cleanUp] cache will not be cleaned up this time");
    }
};

/**
 *
 */
this.Cache.prototype.empty = function() {
    this.promisesMap = new Map();
};
