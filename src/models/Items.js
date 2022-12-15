const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class  Items extends Model {
  
    static associate(models) {
      // define association here
      //  User.belongsTo(models.agency, { foreignKey: 'agency_id', targetKey: 'id' });
    }
  }

   Items.init(
    {
      uuid: DataTypes.UUID,
     
    },

    {
      sequelize,
      modelName: "items",
      underscored: true,
    }
  );
  return  Items;
};

