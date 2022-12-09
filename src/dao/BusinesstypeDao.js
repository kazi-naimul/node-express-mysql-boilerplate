const SuperDao = require('./SuperDao');
const models = require('../models');

const Businesstype = models.businesstype;

class BusinesstypeDao extends SuperDao {
    constructor() {
        super(Businesstype);
    }


   
}

module.exports = BusinesstypeDao;
