const SuperDao = require('./SuperDao');
const models = require('../models');

const Businesscategory = models.branch;

class BusinesscategoryDao extends SuperDao {
    constructor() {
        super(Businesscategory);
    }


   
}

module.exports = BusinesscategoryDao;
