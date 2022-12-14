const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Planbranch extends Model {
    static associate(models) {
      // define association here
      //  User.belongsTo(models.agency, { foreignKey: 'agency_id', targetKey: 'id' });
    }
  }

  Planbranch.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      price: DataTypes.FLOAT,
      start_date: DataTypes.DATEONLY,
      end_date: DataTypes.DATEONLY,
    },

    {
      sequelize,
      modelName: "planbranch",
      underscored: true,
    }
  );
  return Planbranch;
};
