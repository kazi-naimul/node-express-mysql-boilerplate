const SuperDao = require('./SuperDao');
const models = require('../models');

const Businessactivities = models.businessactivity;

class BusinessactivitiesDao extends SuperDao {
    constructor() {
        super(Businessactivities);
    }


   
}

module.exports = BusinessactivitiesDao;
