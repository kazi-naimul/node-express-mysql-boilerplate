const httpStatus = require("http-status");
const BranchService = require("../service/BranchService");
const BusinessService = require("../service/BusinessService");
const BusinesstypeService = require("../service/BusinesstypeService");
const BusinessactivitiyService = require("../service/BusinessactivitiyService");
const BusinesscategoryService = require("../service/BusinesscategoryService");

const UserService = require("../service/UserService");
const logger = require("../config/logger");
const { tokenTypes } = require("../config/tokens");
const { createNewOTP } = require("../helper/otpHelper");
const responseHandler = require("../helper/responseHandler");

class CustomerController {
  constructor() {
    this.userService = new UserService();
    this.businessService = new BusinessService();
    this.branchService = new BranchService();

    this.businesstypeService = new BusinesstypeService();
    this.businessactivitiyService = new BusinessactivitiyService();
    this.businesscategoryService = new BusinesscategoryService();
  }

  getCategoryAds = (myArray) => {
    const promises = myArray.map(async (tt) => {
      const items =
      await this.businesscategoryService.businesscategoryDao.findByWhere({
        businesstypeId: tt.id,
      });
      
    return { title: tt.label, items };
    });
    return Promise.all(promises);
}

  getDashboardAds = async (req, res) => {
    const types = await this.businesstypeService.businessTypeDao.findAll();

    const data = [
      {
        title: "Category",
        items: types,
      },
      ...(await this.getCategoryAds(types))


     
    ];
    console.log(data);
    res.json(responseHandler.returnSuccess(httpStatus[200], "success", data));
  };
}

module.exports = CustomerController;
