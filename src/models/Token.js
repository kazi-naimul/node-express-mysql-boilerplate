const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Token extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
    }

    Token.init(
        {
            token: DataTypes.STRING,
            user_uuid: DataTypes.UUID,
            type: DataTypes.STRING,
            expires: DataTypes.DATE,
            blacklisted: DataTypes.BOOLEAN,
        },
        {
            sequelize,
            modelName: 'token',
            underscored: true,
        },
    );
    return Token;
};
