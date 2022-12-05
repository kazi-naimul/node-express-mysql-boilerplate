const passport = require('passport');
const httpStatus = require('http-status');
const ApiError = require('../helper/ApiError');
const responseHandler = require("../helper/responseHandler");


const verifyCallback = (req, res, resolve, reject,isAdmin) => {

    return async (err, user, info) => {
        if (err || info || !user || isAdmin && !user.isAdmin) {
            return reject(new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate'));
        }
        req.user = user;

        resolve();
    };
};

const auth = (isAdmin=false) => {

    return async (req, res, next) => {
        return new Promise((resolve, reject) => {

            passport.authenticate(
                'jwt',
                { session: false },
                verifyCallback(req, res, resolve, reject,isAdmin),
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
