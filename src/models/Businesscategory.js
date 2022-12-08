const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Businesscategory extends Model {
    static associate(models) {
      // define association here
      //  User.belongsTo(models.agency, { foreignKey: 'agency_id', targetKey: 'id' });
    }
  }

  Businesscategory.init(
    {
      label: DataTypes.STRING,
    },

    {
      sequelize,
      modelName: "businesscategory",
      underscored: true,
    }
  );
  return Businesscategory;
};
