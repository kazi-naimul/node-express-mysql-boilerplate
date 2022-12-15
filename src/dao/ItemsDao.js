const SuperDao = require('./SuperDao');
const models = require('../models');

const Items = models.Items;

class ItemsDao extends SuperDao {
    constructor() {
        super(Items);
    }


   
}

module.exports = ItemsDao;
