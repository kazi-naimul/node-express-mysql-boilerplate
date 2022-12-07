const httpStatus = require('http-status');
const { v4: uuidv4 } = require('uuid');
const BusinessTypeDao = require('../dao/BusinessTypeDao');
const responseHandler = require('../helper/responseHandler');
const logger = require('../config/logger');

class BusinessTypeService {
    constructor() {
        this.businessTypeDao = new BusinessTypeDao();
    }


    
   
}

module.exports = BusinessTypeService;
