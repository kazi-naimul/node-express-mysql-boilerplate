const httpStatus = require('http-status');
const { v4: uuidv4 } = require('uuid');
const BusinessDao = require('../dao/BusinessDao');
const responseHandler = require('../helper/responseHandler');
const logger = require('../config/logger');

class BusinessService {
    constructor() {
        this.businessDao = new BusinessDao();
    }

    
   
}

module.exports = BusinessService;
