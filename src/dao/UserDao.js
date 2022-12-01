const SuperDao = require('./SuperDao');
const models = require('../models');

const User = models.user;

class UserDao extends SuperDao {
    constructor() {
        super(User);
    }

    async findByEmail(email) {
        return User.findOne({ where: { email } });
    }

    async findByPhoneNumber(phone_number) {
        return User.findOne({ where: { phone_number } });
    }


    async isEmailExists(email) {
        return User.count({ where: { email } }).then((count) => {
            if (count != 0) {
                return true;
            }
            return false;
        });
    }

    async isAlreadyExists(value, key) {
        return User.count({ where: {[key]: value } }).then((count) => {
            if (count != 0) {
                return true;
            }
            return false;
        });
    }
    

    async createWithTransaction(user, transaction) {
        return User.create(user, { transaction });
    }
}

module.exports = UserDao;
