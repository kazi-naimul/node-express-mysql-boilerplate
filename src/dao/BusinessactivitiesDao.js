const SuperDao = require('./SuperDao');
const models = require('../models');

const Businessactivities = models.branch;

class BusinessactivitiesDao extends SuperDao {
    constructor() {
        super(Businessactivities);
    }


   
}

module.exports = BusinessactivitiesDao;
