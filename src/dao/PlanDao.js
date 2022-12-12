const SuperDao = require('./SuperDao');
const models = require('../models');

const Plan = models.plan;

class PlanDao extends SuperDao {
    constructor() {
        super(Plan);
    }


   
}

module.exports = PlanDao;
