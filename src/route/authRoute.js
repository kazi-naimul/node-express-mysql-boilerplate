const express = require('express');
const AuthController = require('../controllers/AuthController');
const UserValidator = require('../validator/UserValidator');
var path = require('path')

const router = express.Router();
const auth = require('../middlewares/auth');
const multer = require("multer");

const authController = new AuthController();
const userValidator = new UserValidator();
const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "registration");
    },
    filename: (req, file, cb) => {
      cb(null,  file.fieldname+'_'+Date.now()+path.extname(file.originalname) );
    },
  });
router.use(multer({storage:fileStorage}).any("images"));

router.post('/register',  authController.register);
router.post('/email-exists', userValidator.checkEmailValidator, authController.checkEmail);
// router.post('/login', userValidator.userLoginValidator, authController.login);
router.post('/refresh-token', authController.refreshTokens);
router.post('/send-otp', authController.sendOtp);
router.post('/login-otp', authController.loginWithOtp);

router.post('/logout', authController.logout);
router.put(
    '/change-password',
    auth(),
    userValidator.changePasswordValidator,
    authController.changePassword,
);

module.exports = router;
