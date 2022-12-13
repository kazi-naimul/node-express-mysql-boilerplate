const httpStatus = require('http-status');
const { v4: uuidv4 } = require('uuid');
const AddonDao = require('../dao/AddonDao');
const responseHandler = require('../helper/responseHandler');
const logger = require('../config/logger');

class AddonService {
    constructor() {
        this.addonDao = new AddonDao();
    }


    
   
}

module.exports = AddonService;
