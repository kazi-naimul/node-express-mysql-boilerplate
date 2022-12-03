const SuperDao = require('./SuperDao');
const models = require('../models');

const Branch = models.branch;

class BranchDao extends SuperDao {
    constructor() {
        super(Branch);
    }

   
}

module.exports = BranchDao;
