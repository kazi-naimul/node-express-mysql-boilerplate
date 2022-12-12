const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Role extends Model {
    static associate(models) {
      // define association here
      //  User.belongsTo(models.agency, { foreignKey: 'agency_id', targetKey: 'id' });
    }
  }

  Role.init(
    {
      name: DataTypes.STRING,

    },

    {
      sequelize,
      modelName: "role",
      underscored: true,
    }
  );
  return Role;
};
