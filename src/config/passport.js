const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const UserDao = require('../dao/UserDao');
const config = require('./config');
const { tokenTypes } = require('./tokens');
const TokenDao = require('../dao/TokenDao');
const RedisService = require('../service/RedisService');
const models = require('../models');

const User = models.user;
const jwtOptions = {
    secretOrKey: config.jwt.secret,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    passReqToCallback: true,
};

const jwtVerify = async (req, payload, done) => {
    try {
        if (payload.type !== tokenTypes.ACCESS) {
            throw new Error('Invalid token type');
        }
        const userDao = new UserDao();
        const tokenDao = new TokenDao();
        const redisService = new RedisService();
        const authorization =
            req.headers.authorization !== undefined ? req.headers.authorization.split(' ') : [];
        if (authorization[1] === undefined) {
            return done(null, false);
        }

        let tokenDoc = redisService.hasToken(authorization[1], 'access_token');
        if (!tokenDoc) {
            console.log('Cache Missed!');
            tokenDoc = await tokenDao.findOne({
                token: authorization[1],
                type: tokenTypes.ACCESS,
                blacklisted: false,
            });
        }

        if (!tokenDoc) {
            return done(null, false);
        }
        let user = await redisService.getUser(payload.sub);
        if (user) {
            user = new User(user);
        }

        if (!user) {
            console.log('User Cache Missed!');
            user = await userDao.findOneByWhere({ uuid: payload.sub });
            redisService.setUser(user);
        }

        if (!user) {
            return done(null, false);
        }

        done(null, user);
    } catch (error) {
        console.log(error);
        done(error, false);
    }
};

const jwtStrategy = new JwtStrategy(jwtOptions, jwtVerify);

module.exports = {
    jwtStrategy,
};
