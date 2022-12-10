const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class  Businessactivity extends Model {
  
    static associate(models) {
      // define association here
      //  User.belongsTo(models.agency, { foreignKey: 'agency_id', targetKey: 'id' });
    }
  }

   Businessactivity.init(
    {
      label: DataTypes.STRING,
     
    },

    {
      sequelize,
      modelName: "businessactivity",
      underscored: true,
    }
  );
  return  Businessactivity;
};

