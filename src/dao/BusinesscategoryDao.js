const SuperDao = require('./SuperDao');
const models = require('../models');

const Businesscategory = models.businesscategory;

class BusinesscategoryDao extends SuperDao {
    constructor() {
        super(Businesscategory);
    }


   
}

module.exports = BusinesscategoryDao;
