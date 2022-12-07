const httpStatus = require("http-status");
const AuthService = require("../service/AuthService");
const TokenService = require("../service/TokenService");
const UserService = require("../service/UserService");
const logger = require("../config/logger");
const { branchStatus } = require("../config/constant");
const pluralize = require("pluralize");
const {crudOperations} = require("../helper/utilHelper");


const responseHandler = require("../helper/responseHandler");
const { omit } = require("lodash");
class ProfileController {
  constructor() {
    this.userService = new UserService();
    this.tokenService = new TokenService();
    this.authService = new AuthService();
  }

  getAddressRecord = async (req, res) => {
    const { id } = req.body;
    if (!id) {
      res.send(
        responseHandler.returnError(httpStatus.BAD_REQUEST, "Id is mandatory")
      );
      return;
    }

    const record = await req.user.getAddresses({
      where: {
        id,
      },
    });

    if (record.length === 0) {
      res.send(
        responseHandler.returnError(
          httpStatus.BAD_REQUEST,
          "Id: " + id + " Not found"
        )
      );
      return;
    }

    return record;
  };

  updateDetailsForActivation = async (req, res) => {
    const images = {};
    req.files.forEach((file) => {
      images[file.fieldname] = utilHandler.getAbsolutePath(file.filename);
    });
    const details = { ...JSON.parse(req.body.details), ...images };

    const { user } = details;
    try {
      let result = omit(details, [
        "phone_number",
        "mpin",
        "isAdmin",
        "uuid",
        "status",
      ]);
      console.log(result);
      await user.update(result);
      const business = (
        await user.getBusinesses({ where: { id: result.businessId } })
      )[0];
      await business.update(result);
      const branch = (
        await business.getBranches({ where: { id: result.id } })
      )[0];
      if (user.isAdmin && req.body.changeActivation) {
        result.status = branchStatus.STATUS_ACTIVE;
      }
      await branch.update(result);

      // await user.setBusiness(result);

      res.json(
        responseHandler.returnSuccess(
          httpStatus.OK,
          "Success",
          user,
          business,
          branch
        )
      );
    } catch (e) {
      console.error(e);
      res.json(
        responseHandler.returnError(
          httpStatus.BAD_REQUEST,
          "Invalid request, pass right ids"
        )
      );
    }
  };

  curdUserAssociated = async (req, res) => {

    const { source, target } = req.params;

     crudOperations({req,res,source,target})
  };
}

module.exports = ProfileController;
