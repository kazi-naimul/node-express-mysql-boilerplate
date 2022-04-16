const SuperDao = require('./SuperDao');
const models = require('../models');

const Token = models.token;

class TokenDao extends SuperDao {
    constructor() {
        super(Token);
    }

    async findOne(where) {
        return Token.findOne({ where });
    }

    async remove(where) {
        return Token.destroy({ where });
    }
}

module.exports = TokenDao;
