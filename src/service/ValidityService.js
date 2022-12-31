const httpStatus = require('http-status');
const ValidityDao = require('../dao/ValidityDao');
const responseHandler = require('../helper/responseHandler');
const logger = require('../config/logger');

class ValidityService {
    constructor() {
        this.validityDao = new ValidityDao();
    }


    
   
}

module.exports = ValidityService;
