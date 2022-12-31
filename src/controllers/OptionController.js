const httpStatus = require("http-status");
const BusinessTypeService = require("../service/BusinesstypeService");
const BusinesscategoryService = require("../service/BusinesscategoryService");
const BusinessactivityService = require("../service/BusinessactivitiyService");
const responseHandler = require("../helper/responseHandler");
const { omit } = require("lodash");
class OptionController {

  updateJson =({jsonFile,tabIndex,groupIndex,fieldIndex,value})=>{
    jsonFile[tabIndex].details[groupIndex].fields[fieldIndex].fields =
    value.map((dd) => {
      return {
        ...jsonFile[tabIndex].details[groupIndex].fields[fieldIndex]
          .fields[0],
        ...dd,
      };
    });

    return jsonFile;
  }




   getFields=async(req, res)=> {
    const { type } = req.query;
    if (!type) {
      res.json(
        responseHandler.returnError(httpStatus.OK, "type param is mandatory")
      );
    }
    try {
      const jsonFile = require(`../json/${type}.json`);
      const businessType =
        await new BusinessTypeService().businessTypeDao.findAll({
          raw: true,
        });

      const businessCategory =
        await new BusinesscategoryService().businesscategoryDao.findAll({
          raw: true,
        });
        const businessActivity =
        await new BusinessactivityService().businessactivitiyDao.findAll({
          raw: true,
        });

 
      jsonFile.forEach((tab, tabIndex) => {
        tab.details.forEach((group, groupIndex) => {
          group.fields.forEach((field, fieldIndex) => {
            if (field.requestKey === "business_type") {
              console.log(tabIndex, groupIndex, fieldIndex);
              this.updateJson({jsonFile,tabIndex,groupIndex,fieldIndex,value:businessType})
            }
            else if(field.requestKey === "business_category"){
              this.updateJson({jsonFile,tabIndex,groupIndex,fieldIndex,value:businessCategory})
            }
            else if(field.requestKey === "business_activities"){
              this.updateJson({jsonFile,tabIndex,groupIndex,fieldIndex,value:businessActivity})
            }
          });
        });
      });

    

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
