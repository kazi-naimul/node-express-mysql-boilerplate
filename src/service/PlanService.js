const httpStatus = require('http-status');
const { v4: uuidv4 } = require('uuid');
const PlanDao = require('../dao/PlanDao');
const responseHandler = require('../helper/responseHandler');
const logger = require('../config/logger');

class PlanService {
    constructor() {
        this.planDao = new PlanDao();
    }


    
   
}

module.exports = PlanService;
