class RedisHelper {
    constructor(redisClient) {
        this.redisClient = redisClient;
    }

    /**
     * Set Value
     * @param {String} key
     * @param {String/JSON} value
     * @returns {String/Boolean}
     */
    set = async (key, value) => {
        try {
            if (typeof value === 'JSON')
                value = JSON.stringify(value);
            return await this.redisClient.set(key, value)
        } catch (e) {
            return false;
        }

    }
    /**
     * Set Value with Expiry
     * @param {String} key
     * @param {Integer} seconds
     * @param {String/JSON} value
     * @returns {String/boolean}
     */
    setEx = async (key, seconds, value) => {
        try {

            if (typeof value === 'JSON')
                value = JSON.stringify(value);
            return await this.redisClient.setEx(key, seconds, value);

        } catch (e) {
            return false;
        }

    }
    /**
     * Get Value
     * @param {String} key
     * @returns {String>}
     */
    get = async (key) => {
        try {
            return await this.redisClient.get(key)

        } catch (e) {
            return null;
        }
    }
    /**
     * Delete Value
     * @param {String} key
     * @returns {Boolean}
     */
    del = async (key) => {
        try {
            return await this.redisClient.del(key);
        } catch (e) {
            return false;
        }
    }

    scanStream = async (key) => {
        try {
            await this.redisClient.scanStream({
                // only returns keys following the pattern of "key"
                match: key,
                // returns approximately 100 elements per call
                count: 100
            })
        } catch (e) {
            return false;
        }
    }


}

module.exports = RedisHelper;