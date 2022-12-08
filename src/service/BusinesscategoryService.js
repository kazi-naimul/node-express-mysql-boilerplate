const httpStatus = require('http-status');
const { v4: uuidv4 } = require('uuid');
const BusinesscategoryDao = require('../dao/BusinesscategoryDao');
const responseHandler = require('../helper/responseHandler');
const logger = require('../config/logger');

class BusinesscategoryService {
    constructor() {
        this.businesscategoryDao = new BusinesscategoryDao();
    }


    
   
}

module.exports = BusinesscategoryService;
