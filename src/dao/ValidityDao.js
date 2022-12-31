const SuperDao = require('./SuperDao');
const models = require('../models');

const Validity = models.validity;

class ValidityDao extends SuperDao {
    constructor() {
        super(Validity);
    }


   
}

module.exports = ValidityDao;
