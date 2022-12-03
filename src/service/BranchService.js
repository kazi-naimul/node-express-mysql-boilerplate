const httpStatus = require("http-status");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");
const BranchDao = require("../dao/BranchDao");
const BusinessDao = require("../dao/BusinessDao");
const {groupBy} = require('lodash');
const responseHandler = require("../helper/responseHandler");
const logger = require("../config/logger");
const { userConstant } = require("../config/constant");

class BranchService {
  constructor() {
    this.branchDao = new BranchDao();
    this.businessDao = new BusinessDao();
  }

  getBranchesForActivation = async () => {
    const branches = await this.branchDao.findAll({
      include: this.businessDao.Model,
    });

    const groups = groupBy(branches,'business.business_type_label');
    console.log(groups);
    // console.log(branches[0].business.whatsapp_communication)
    return responseHandler.returnSuccess(
      httpStatus.OK,
      "Successfully fetched all branches pending for activation",
      groups
    );
  };
}

module.exports = BranchService;
