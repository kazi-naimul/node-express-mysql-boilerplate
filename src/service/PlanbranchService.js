const httpStatus = require('http-status');
const { v4: uuidv4 } = require('uuid');
const PlanbranchDao = require('../dao/PlanbranchDao');
const responseHandler = require('../helper/responseHandler');
const logger = require('../config/logger');

class PlanbranchService {
    constructor() {
        this.planbranchDao = new PlanbranchDao();
    }


    
   
}

module.exports = PlanbranchService;
