const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            User.belongsTo(models.agency, { foreignKey: 'agency_id', targetKey: 'id' });
        }
    }

    User.init(
        {
            uuid: DataTypes.UUID,
            first_name: DataTypes.STRING,
            last_name: DataTypes.STRING,
            email: DataTypes.STRING,
            password: DataTypes.STRING,
            status: DataTypes.INTEGER,
            role: DataTypes.INTEGER,
            email_verified: DataTypes.INTEGER,
            default_user: DataTypes.INTEGER,
            agency_id: DataTypes.INTEGER,
            address: DataTypes.STRING,
            phone_number: DataTypes.STRING,
            google_id: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: 'user',
            underscored: true,
        },
    );
    return User;
};
