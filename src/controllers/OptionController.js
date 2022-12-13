const httpStatus = require("http-status");
const AuthService = require("../service/AuthService");
const TokenService = require("../service/TokenService");
const BusinessTypeService = require("../service/BusinesstypeService");
const BusinesscategoryService = require("../service/BusinesscategoryService");
const BusinessactivityService = require("../service/BusinessactivitiyService");
const logger = require("../config/logger");
const { tokenTypes } = require("../config/tokens");
const { createNewOTP } = require("../helper/otpHelper");
const responseHandler = require("../helper/responseHandler");
const {omit} = require('lodash');
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
        const data = await new BusinessTypeService().businessTypeDao.findAll({
          raw: true,
        });
        jsonFile[1].details[1].fields[0].fields = data.map((dd) => {
          return {
            type: "option",
            label: "Beauty",
            requestKey: "business_type",
            eligility: ["PARTNER"],
            ...dd,
          };
        });
      }
      else if(type ==="activate"){
        const data = await new BusinessTypeService().businessTypeDao.findAll({
          raw: true,
        });
        const businesscategory = await new BusinesscategoryService().businesscategoryDao.findAll({
          raw: true,
        });

        const businessactivity = await new BusinessactivityService().businessactivitiyDao.findAll({
          raw: true,
        });

       
        jsonFile[1].details[1].fields[0].fields = data.map((dd) => {
          return {
            ...jsonFile[1].details[1].fields[0].fields[0],
            ...omit(dd,['createdAt','updatedAt','userId'])
          };
        });


        jsonFile[1].details[2].fields = businesscategory.map((dd) => {
          return {
            ...jsonFile[1].details[2].fields[0],

            ...omit(dd,['createdAt','updatedAt','userId'])
            
          };
        });


      console.log(jsonFile[1].details[3]);
        jsonFile[1].details[3].fields[0].fields = businessactivity.map((dd) => {
          return {
            ...jsonFile[1].details[3].fields[0].fields[0],

            ...omit(dd,['createdAt','updatedAt','userId'])
            
          };
        });


        // console.log('test',  jsonFile[1].details[3].fields[0].fields )
        console.log('test',  businessactivity)
        businessactivity.map((dd) => {
          return {
            ...jsonFile[1].details[3].fields[0].fields,

            ...omit(dd,['createdAt','updatedAt','userId'])
            
          };
        })

      }

      res.json(
        responseHandler.returnSuccess(httpStatus.OK, "Success", jsonFile)
      );
    } catch (e) {
      console.log(e);
      if (e.code === "MODULE_NOT_FOUND") {
        res.json(
          responseHandler.returnError(httpStatus.OK, "Invalid type param")
        );
      }
      res.json(responseHandler.returnError(httpStatus.OK, "Error"));
    }
  }
}

module.exports = OptionController;
