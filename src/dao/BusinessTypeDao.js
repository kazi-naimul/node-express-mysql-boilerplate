const SuperDao = require('./SuperDao');
const models = require('../models');

const BusinessType = models.branch;

class BusinessTypeDao extends SuperDao {
    constructor() {
        super(BusinessType);
    }


   
}

module.exports = BusinessTypeDao;
