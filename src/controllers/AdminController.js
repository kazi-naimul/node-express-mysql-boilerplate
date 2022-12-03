const httpStatus = require("http-status");
const BranchService = require("../service/BranchService");
const BusinessService = require("../service/BusinessService");
const UserService = require("../service/UserService");
const logger = require("../config/logger");
const { tokenTypes } = require("../config/tokens");
const { createNewOTP } = require("../helper/otpHelper");
const responseHandler = require("../helper/responseHandler");

class AdminController {
  constructor() {
    this.userService = new UserService();
    this.businessService = new BusinessService();
    this.branchService = new BranchService();
  }

  getActivationGroup=async (req,res)=>{
      console.log(this)
      const response = await this.branchService.getBranchesForActivation()
      res.json(response);
  }
}

module.exports = AdminController;
