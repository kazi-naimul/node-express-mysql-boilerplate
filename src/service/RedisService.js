const redisClient = require('../config/redisClient');
const RedisHelper = require('../helper/RedisHelper');
const { jwt } = require('../config/config');

class RedisService {
    constructor() {
        this.redisHelper = new RedisHelper(redisClient);
    }

    /**
     * Create access and refresh tokens
     * @param {String} uuid
     * @param {Object} tokens
     * @returns {boolean}
     */
    createTokens = async (uuid, tokens) => {
        const accessKey = `access_token:${tokens.access.token}`;
        const refreshKey = `refresh_token:${tokens.refresh.token}`;
        const accessKeyExpires = jwt.accessExpirationMinutes * 60;
        const refreshKeyExpires = jwt.refreshExpirationDays * 24 * 60 * 60;
        await this.redisHelper.setEx(accessKey, accessKeyExpires, uuid);
        await this.redisHelper.setEx(refreshKey, refreshKeyExpires, uuid);
        return true;
    };

    /**
     * Create access and refresh tokens
     * @param {String} token
     * @param {String} type [access_token,refresh_token]
     * @returns {boolean}
     */
    hasToken = async (token, type = 'access_token') => {
        const hasToken = await this.redisHelper.get(`${type}:${token}`);
        if (hasToken != null) {
            return true;
        }
        return false;
    };

    /**
     * Remove access and refresh tokens
     * @param {String} token
     * @param {String} type [access_token,refreshToken]
     * @returns {boolean}
     */
    removeToken = async (token, type = 'access_token') => {
        return this.redisHelper.del(`${type}:${token}`);
    };

    /**
     * Get user
     * @param {String} uuid
     * @returns {Object/Boolean}
     */
    getUser = async (uuid) => {
        const user = await this.redisHelper.get(`user:${uuid}`);
        if (user != null) {
            return JSON.parse(user);
        }
        return false;
    };

    /**
     * Set user
     * @param {Object} user
     * @returns {boolean}
     */
    setUser = async (user) => {
        const setUser = await this.redisHelper.set(`user:${user.uuid}`, JSON.stringify(user));
        if (!setUser) {
            return true;
        }
        return false;
    };
}

module.exports = RedisService;
