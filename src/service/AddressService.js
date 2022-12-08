const SuperDao = require('./SuperDao');
const models = require('../models');

const AddressService = models.branch;

class AddressService extends SuperDao {
    constructor() {
        super(AddressService);
    }

   
}

module.exports = AddressService;
