const httpStatus = require("http-status");
const AuthService = require("../service/AuthService");
const TokenService = require("../service/TokenService");
const BusinessTypeService = require("../service/businessTypeService");
const logger = require("../config/logger");
const { tokenTypes } = require("../config/tokens");
const { createNewOTP } = require("../helper/otpHelper");
const responseHandler = require("../helper/responseHandler");

class OptionController {
  async getFields(req, res) {
    const { type } = req.query;
    if (!type) {
      res.json(
        responseHandler.returnError(httpStatus.OK, "type param is mandatory")
      );
    }
    try {
      const jsonFile = require(`../json/${type}.json`);

      if (type === "register") {
        const data = await new BusinessTypeService().businessTypeDao.findAll({raw:true});
        jsonFile[1].details[1].fields[0].fields = data.map((dd)=>{

          return {
            "type": "option",
                                        "label": "Beauty",
                                        "requestKey": "business_type",
                                        "eligility": [
                                            "PARTNER"
                                        ],
            ...dd,
          
          }
        });

      }
      
      res.json(
        responseHandler.returnSuccess(httpStatus.OK, "Success", jsonFile)
      );
    } catch (e) {
      console.log(e)
      if (e.code === "MODULE_NOT_FOUND") {
        res.json(
          responseHandler.returnError(httpStatus.OK, "Invalid type param")
        );
      }
      res.json(
        responseHandler.returnError(httpStatus.OK, "Error")
      );
    }
  }
}

module.exports = OptionController;
