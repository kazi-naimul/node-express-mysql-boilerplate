const httpStatus = require("http-status");
const AuthService = require("../service/AuthService");
const TokenService = require("../service/TokenService");
const UserService = require("../service/UserService");
const logger = require("../config/logger");
const { tokenTypes } = require("../config/tokens");
const { createNewOTP } = require("../helper/otpHelper");
const responseHandler = require("../helper/responseHandler");

class OptionController {
  
  getFields(req,res){

    const { type } = req.query;
    if (!type) {
      res.json(responseHandler.returnError(httpStatus.OK,'type param is mandatory'))

   
    }
    try {

      res.json(responseHandler.returnSuccess(httpStatus.OK,'Success',require(`../json/${type}.json`)))
 
    } catch (e) {
      if (e.code === "MODULE_NOT_FOUND") {
        res.json(responseHandler.returnError(httpStatus.OK,'Invalid type param'))

      }
    }

  }
  
}

module.exports = OptionController;
