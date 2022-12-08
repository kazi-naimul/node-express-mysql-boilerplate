const SuperDao = require('./SuperDao');
const models = require('../models');

const Address = models.branch;

class AddressDao extends SuperDao {
    constructor() {
        super(Address);
    }


   
}

module.exports = AddressDao;
