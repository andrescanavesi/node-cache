const promisesMap = new Map();

/**
 * @param name a name to identify this cache, example "find all users cache"
 * @param duration cache duration in seconds
 * @param func the function to execute
 */
module.exports.Cache = function(name, duration, func) {
    this.name = name;
    this.duration = duration;
    this.func = func;
};

this.Cache.prototype.getStats = function() {
    const stats = {
        cache_name: this.name,
        size: promisesMap.size,
    };
    return stats;
};

this.Cache.prototype.getData = function(key) {
    if (promisesMap.has(key)) {
        return promisesMap.has(key);
    } else {
        const promise = new Promise((resolve, reject) => {
            try {
                resolve(this.func(key));
            } catch (error) {
                reject(error);
            }
        });
        promisesMap.set(key, promise);
        return promise;
    }
    //return `${this.duration} duration.`;
};
