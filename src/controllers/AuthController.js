const httpStatus = require("http-status");
const AuthService = require("../service/AuthService");
const TokenService = require("../service/TokenService");
const UserService = require("../service/UserService");
const logger = require("../config/logger");
const { tokenTypes } = require("../config/tokens");
const { createNewOTP } = require("../helper/otpHelper");
const responseHandler = require("../helper/responseHandler");

class AuthController {
  constructor() {
    this.userService = new UserService();
    this.tokenService = new TokenService();
    this.authService = new AuthService();
  }

  register = async (req, res) => {
    try {
      const user = await this.userService.createUser(req.body);
      let tokens = {};
      const { status } = user.response;
      console.log(status);
      if (user.response.status) {
        tokens = await this.tokenService.generateAuthTokens(user.response.data);
      }

      const { message, data } = user.response;
      res.status(user.statusCode).send({ status, message, data, tokens });
    } catch (e) {
      logger.error(e);
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  };

  sendOtp = async (req, res) => {
    console.log(req.body);
    const hash = await createNewOTP(req.body.phone_number);
    res.json(
      responseHandler.returnSuccess(
        httpStatus[200],
        "OTP Sent successfully",
        hash
      )
    );
  };


  
  checkEmail = async (req, res) => {
    try {
      const isExists = await this.userService.isEmailExists(
        req.body.email.toLowerCase()
      );
      res.status(isExists.statusCode).send(isExists.response);
    } catch (e) {
      logger.error(e);
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  };

  loginWithOtp = async (req, res) => {
    try {
      const {  phone_number , otp, hash,mode } = req.body;
      const user = await this.authService.loginWithOtp(
        phone_number , hash,otp
      );
      const { message } = user.response;
      const { data } = user.response;
      const { status } = user.response;
      const code = user.statusCode;
      let tokens = {};
      if (user.response.status) {
        // if(!user.mode.includes(mode)){
        //   console.log({user});
        // }
        tokens = await this.tokenService.generateAuthTokens(data);
      }
      res.status(user.statusCode).send({ status, code, message, data, tokens });
    } catch (e) {
      logger.error(e);
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  };

  logout = async (req, res) => {
    await this.authService.logout(req, res);
    res.status(httpStatus.NO_CONTENT).send();
  };

  refreshTokens = async (req, res) => {
    try {
      const refreshTokenDoc = await this.tokenService.verifyToken(
        req.body.refresh_token,
        tokenTypes.REFRESH
      );
      const user = await this.userService.getUserByUuid(
        refreshTokenDoc.user_uuid
      );
      if (user == null) {
        res.status(httpStatus.BAD_GATEWAY).send("User Not Found!");
      }
      await this.tokenService.removeTokenById(refreshTokenDoc.id);
      const tokens = await this.tokenService.generateAuthTokens(user);
      res.send(tokens);
    } catch (e) {
      logger.error(e);
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  };

  changePassword = async (req, res) => {
    try {
      const responseData = await this.userService.changePassword(
        req.body,
        req.user.uuid
      );
      res.status(responseData.statusCode).send(responseData.response);
    } catch (e) {
      logger.error(e);
      res.status(httpStatus.BAD_GATEWAY).send(e);
    }
  };
}

module.exports = AuthController;
