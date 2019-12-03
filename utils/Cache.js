/**
 * @param name a name to identify this cache, example "find all users cache"
 * @param duration cache duration in millis
 * @param size max quantity of elements to cache. After that the cache will remove the oldest element
 * @param func the function to execute (our heavy operation)
 */
module.exports.Cache = function(name, duration, size, func) {
    if (!name) {
        throw Error("name cannot be empty");
    }
    if (!duration) {
        throw Error("duration cannot be empty");
    }
    if (isNaN(duration)) {
        throw Error("duration is not a number");
    }
    if (duration < 0) {
        throw Error("duration must be positive");
    }
    if (!size) {
        throw Error("size cannot be empty");
    }
    if (isNaN(size)) {
        throw Error("size is not a number");
    }
    if (size < 0) {
        throw Error("size must be positive");
    }
    if (!func) {
        throw Error("func cannot be empty");
    }
    if (typeof func !== "function") {
        throw Error("func must be a function");
    }

    this.name = name;
    this.duration = duration;
    this.size = size;
    this.func = func;
    this.cacheCalls = 0;
    this.dataCalls = 0;
    /**
     * Millis of the lates cache clean up
     */
    this.latestCleanUp = Date.now();
    /**
     * A collection to keep our promises with the cached data.
     * key: a primitive or an object to identify our cached object
     * value: {created_at: <a date>, promise: <the promise>}
     */
    this.promisesMap = new Map();
};

/**
 * @returns
 */
this.Cache.prototype.getStats = function(showContent) {
    const stats = {
        name: this.name,
        max_size: this.size,
        current_size: this.promisesMap.size,
        duration_in_seconds: this.duration / 1000,
        cache_calls: this.cacheCalls,
        data_calls: this.dataCalls,
        total_calls: this.cacheCalls + this.dataCalls,
        latest_clean_up: new Date(this.latestCleanUp),
    };
    let hitsPercentage = 0;
    if (stats.total_calls > 0) {
        hitsPercentage = Math.round((this.cacheCalls * 100) / stats.total_calls);
    }
    stats.hits_percentage = hitsPercentage;
    if (showContent) {
        stats.content = [];
        for (let [key, value] of this.promisesMap) {
            stats.content.push({key: key, created_at: new Date(value.created_at)});
        }
    }
    return stats;
};

/**
 * @param {*} key
 */
this.Cache.prototype.getData = function(key) {
    if (this.promisesMap.has(key)) {
        console.info(`[${this.name}] Returning cache for the key: ${key}`);
        /*
         * We have to see if our cached objects did not expire.
         * If expired we have to get freshed data
         */
        if (this.isObjectExpired(key)) {
            this.dataCalls++;
            return this.getFreshedData(key);
        } else {
            this.cacheCalls++;
            return this.promisesMap.get(key).promise;
        }
    } else {
        this.dataCalls++;
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
    this.promisesMap.set(key, cacheElem);
    return promise;
};

/**
 * @param {*} key
 */
this.Cache.prototype.isObjectExpired = function(key) {
    if (!this.promisesMap.has(key)) {
        return false;
    } else {
        const object = this.promisesMap.get(key);
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
    if (this.promisesMap.size >= this.size || Date.now() - this.latestCleanUp > this.duration) {
        let oldest = Date.now();
        let oldestKey = null;
        //iterate the map to remove the expired objects and calculate the oldest objects to
        //be removed in case the cache is full after removing expired objects
        for (let [key, value] of this.promisesMap) {
            if (this.isObjectExpired(key)) {
                console.info(`the key ${key} is expired and will be deleted form the cache`);
                this.promisesMap.delete(key);
            } else if (value.created_at < oldest) {
                oldest = value.created_at;
                oldestKey = key;
            }
        }

        //if after this clean up our cache is still full we delete the oldest
        if (this.promisesMap.size >= this.size && oldestKey !== null) {
            console.info(`the oldest element with the key ${oldestKey} in the cache was deleted`);
            this.promisesMap.delete(oldestKey);
        }
    } else {
        console.info("[cleanUp] cache will not be cleaned up this time");
    }
};

/**
 * Resets all the cache.
 * Useful when we update several values in our data source
 */
this.Cache.prototype.reset = function() {
    this.promisesMap = new Map();
    this.latestCleanUp = Date.now();
    this.cacheCalls = 0;
    this.dataCalls = 0;
};
