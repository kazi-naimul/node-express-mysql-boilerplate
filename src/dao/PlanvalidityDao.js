const SuperDao = require('./SuperDao');
const models = require('../models');

const Planvalidity = models.planvalidity;

class PlanvalidityDao extends SuperDao {
    constructor() {
        super(Planvalidity);
    }


   
}

module.exports = PlanvalidityDao;
