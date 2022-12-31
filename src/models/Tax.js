const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Tax extends Model {
    static associate(models) {
      // define association here
      //  User.belongsTo(models.agency, { foreignKey: 'agency_id', targetKey: 'id' });
    }
  }

  Tax.init(
    {
      label: { type: DataTypes.STRING, defaultValue: "GST" },
      value: DataTypes.FLOAT,
    },
    {
      sequelize,
      modelName: "tax",
      underscored: true,
    }
  );
  return Tax;
};
