const SuperDao = require('./SuperDao');
const models = require('../models');

const Tax = models.tax;

class TaxDao extends SuperDao {
    constructor() {
        super(Tax);
    }


   
}

module.exports = TaxDao;
