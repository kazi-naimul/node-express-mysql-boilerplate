const httpStatus = require("http-status");
const AuthService = require("../service/AuthService");
const TokenService = require("../service/TokenService");
const UserService = require("../service/UserService");
const logger = require("../config/logger");
const { tokenTypes } = require("../config/tokens");
const { createNewOTP } = require("../helper/otpHelper");
const responseHandler = require("../helper/responseHandler");

class ProfileController {
  constructor() {
    this.userService = new UserService();
    this.tokenService = new TokenService();
    this.authService = new AuthService();
  }

  getRecord = async (req, res) => {
    if (!req.body?.id) {
      return res.send(
        responseHandler.returnError(httpStatus.BAD_REQUEST, "Id is mandatory")
      );
    }

    const record = await req.user.getAddresses({
      where: {
        id: req.body?.id,
      },
    });

    if (record.length === 0) {
      return res.send(
        responseHandler.returnError(
          httpStatus.BAD_REQUEST,
          "Id: " + id + " Not found"
        )
      );
    }

    return record;
  };

  addressCurd = async (req, res) => {
    let data;
    let record;

    switch (req.method) {
      case "GET":
        data = await req.user.getAddresses();
        res.json(responseHandler.returnSuccess(httpStatus.OK, "Success", data));
        break;
      case "POST":
        data = await req.user.createAddress(req.body);
        res.json(responseHandler.returnSuccess(httpStatus.OK, "Success", data));
        break;
      case "PUT":
        record = await this.getRecord(req, res);
console.log({record})
        const data = await record[0].update(req.body);
        res.json(responseHandler.returnSuccess(httpStatus.OK, "Success", data));
        break;

      case "DELETE":
        record = await this.getRecord(req, res);

        data = await record[0].destroy();
        res.json(responseHandler.returnSuccess(httpStatus.OK, "Success"));
        break;
    }
  };
}

module.exports = ProfileController;
