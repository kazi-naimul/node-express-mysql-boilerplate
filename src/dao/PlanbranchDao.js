const SuperDao = require('./SuperDao');
const models = require('../models');

const Planbranch = models.planbranch;

class PlanbranchDao extends SuperDao {
    constructor() {
        super(Planbranch);
    }


   
}

module.exports = PlanbranchDao;
