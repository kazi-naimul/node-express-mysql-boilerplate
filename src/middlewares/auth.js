const passport = require('passport');
const httpStatus = require('http-status');
const ApiError = require('../helper/ApiError');
const responseHandler = require("../helper/responseHandler");


const verifyCallback = (req, res, resolve, reject) => {

    return async (err, user, info) => {
        if (err || info || !user) {
            return reject(new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate'));
        }
        req.user = user;

        resolve();
    };
};

const auth = () => {

    return async (req, res, next) => {
        return new Promise((resolve, reject) => {

            passport.authenticate(
                'jwt',
                { session: false },
                verifyCallback(req, res, resolve, reject),
            )(req, res, next);
        })
            .then(() => {

                return next();
            })
            .catch((err) => {
                console.log(err)
                return res.json(responseHandler.returnError(httpStatus.UNAUTHORIZED))
            });
    };
};

module.exports = auth;
