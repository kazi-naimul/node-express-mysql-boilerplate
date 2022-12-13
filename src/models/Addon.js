const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class  Addon extends Model {
  
    static associate(models) {
      // define association here
      //  User.belongsTo(models.agency, { foreignKey: 'agency_id', targetKey: 'id' });
    }
  }

   Addon.init(
    {
      name:DataTypes.STRING,
      module:DataTypes.STRING,
      charges:DataTypes.STRING,
      price:DataTypes.FLOAT,
      tax:DataTypes.FLOAT,
      tax_inclusive: DataTypes.BOOLEAN,
status:DataTypes.STRING,
     
    },

    {
      sequelize,
      modelName: "addon",
      underscored: true,
    }
  );
  return  Addon;
};

