const httpStatus = require("http-status");
const AuthService = require("../service/AuthService");
const TokenService = require("../service/TokenService");
const UserService = require("../service/UserService");
const logger = require("../config/logger");
const { tokenTypes } = require("../config/tokens");
const { createNewOTP } = require("../helper/otpHelper");
const responseHandler = require("../helper/responseHandler");
const {omit}  = require('lodash');
class ProfileController {
  constructor() {
    this.userService = new UserService();
    this.tokenService = new TokenService();
    this.authService = new AuthService();
  }

  getRecord = async (req, res) => {
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

    const {user} = req;

    const result = omit(req.body, ['phone_number','mpin']);
console.log(result);
    await user.update(result);

    res.json(
      responseHandler.returnSuccess(httpStatus.OK, "Success", {...user})
    );
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
        record = await this.getRecord(req, res);
        if (record) {
          const newAddress = await record[0].update(req.body);
          res.json(
            responseHandler.returnSuccess(httpStatus.OK, "Success", newAddress)
          );
        }

        break;

      case "DELETE":
        record = await this.getRecord(req, res);
        if (record) {
          await record[0].destroy();
          res.json(responseHandler.returnSuccess(httpStatus.OK, "Success"));
        }
        break;
    }
  };
}

module.exports = ProfileController;
