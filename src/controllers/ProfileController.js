const httpStatus = require("http-status");
const AuthService = require("../service/AuthService");
const TokenService = require("../service/TokenService");
const UserService = require("../service/UserService");
const logger = require("../config/logger");
const { tokenTypes } = require("../config/tokens");
const { createNewOTP } = require("../helper/otpHelper");
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
    const { user } = req;
    try {
      const result = omit(req.body, [
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
      await branch.update(result);

      // await user.setBusiness(result);

      res.json(responseHandler.returnSuccess(httpStatus.OK, "Success", user,business,branch));
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

  addressCurd = async (req, res) => {
    let data;
    let record;

    switch (req.method) {
      case "GET":
        const addresses = await req.user.getAddresses();
        res.json(
          responseHandler.returnSuccess(httpStatus.OK, "Success", addresses)
        );
        break;
      case "POST":
        const address = await req.user.createAddress(req.body);
        res.json(
          responseHandler.returnSuccess(httpStatus.OK, "Success", address)
        );
        break;
      case "PUT":
        record = await this.getAddressRecord(req, res);
        if (record) {
          const newAddress = await record[0].update(req.body);
          res.json(
            responseHandler.returnSuccess(httpStatus.OK, "Success", newAddress)
          );
        }

        break;

      case "DELETE":
        record = await this.getAddressRecord(req, res);
        if (record) {
          await record[0].destroy();
          res.json(responseHandler.returnSuccess(httpStatus.OK, "Success"));
        }
        break;
    }
  };
}

module.exports = ProfileController;
