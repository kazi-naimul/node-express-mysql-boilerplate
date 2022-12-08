const httpStatus = require('http-status');
const { v4: uuidv4 } = require('uuid');
const BusinessactivitiyDao = require('../dao/BusinessactivitiyDao');
const responseHandler = require('../helper/responseHandler');
const logger = require('../config/logger');

class BusinessactivitiyService {
    constructor() {
        this.businessactivitiyDao = new BusinessactivitiyDao();
    }


    
   
}

module.exports = BusinessactivitiyService;
