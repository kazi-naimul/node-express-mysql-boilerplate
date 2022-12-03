const httpStatus = require('http-status');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const BusinessDao = require('../dao/BusinessDao');
const responseHandler = require('../helper/responseHandler');
const logger = require('../config/logger');
const { userConstant } = require('../config/constant');

class BusinessService {
    constructor() {
        this.businessDao = new BusinessDao();
    }

    
   
}

module.exports = BusinessService;
