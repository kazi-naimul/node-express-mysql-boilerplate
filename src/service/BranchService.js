const httpStatus = require("http-status");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");
const BranchDao = require("../dao/BranchDao");
const BusinessDao = require("../dao/BusinessDao");
const UserDao = require("../dao/UserDao");

const {groupBy} = require('lodash');
const responseHandler = require("../helper/responseHandler");
const logger = require("../config/logger");
const { userConstant } = require("../config/constant");
const {omit} = require('lodash');
class BranchService {
  constructor() {
    this.branchDao = new BranchDao();
    this.businessDao = new BusinessDao();
    this.userDao = new UserDao();

  }

  getBranchesForActivation = async () => {
    const branches = (await this.branchDao.Model.findAll({
      include: [
        {model: this.businessDao.Model, include: [{model:this.userDao.Model}] }
      ],

    })) .map(el => el.get({ plain: true })) ;

    console.log({branches})

    const flattenBranches = branches.map((branch) => {

      const temp = { ...branch, ...branch.business, ...branch.business.user };

      return omit(temp, ["business", "user"]);
    });

    const temp = groupBy(flattenBranches,'business_type_label');
    const groups = Object.keys(temp).map((type) => ({
      type,
      businesses: temp[type],
    }));

    // console.log(branches[0].business.whatsapp_communication)
    return responseHandler.returnSuccess(
      httpStatus.OK,
      "Successfully fetched all branches pending for activation",
      {groups}
    );
  };
}

module.exports = BranchService;
