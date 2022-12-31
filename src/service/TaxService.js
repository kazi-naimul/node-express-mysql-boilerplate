const httpStatus = require('http-status');
const { v4: uuidv4 } = require('uuid');
const TaxDao = require('../dao/TaxDao');
const responseHandler = require('../helper/responseHandler');
const logger = require('../config/logger');

class TaxService {
    constructor() {
        this.taxDao = new TaxDao();
    }


    
   
}

module.exports = TaxService;
