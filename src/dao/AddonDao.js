const SuperDao = require('./SuperDao');
const models = require('../models');

const Addon = models.addon;

class AddonDao extends SuperDao {
    constructor() {
        super(Addon);
    }


   
}

module.exports = AddonDao;
