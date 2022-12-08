const SuperDao = require('./SuperDao');
const models = require('../models');

const Business = models.business;

class BusinessDao extends SuperDao {
    constructor() {
        super(Business);
    }

   
}

module.exports = BusinessDao;
