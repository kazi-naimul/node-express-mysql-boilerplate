const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class  PlanValidity extends Model {
  
    static associate(models) {
      // define association here
      //  User.belongsTo(models.agency, { foreignKey: 'agency_id', targetKey: 'id' });
    }
  }

   PlanValidity.init(
    {
        validity:DataTypes.INTEGER,
        price:DataTypes.FLOAT
        
     
    },

    {
      sequelize,
      modelName: "planvalidity",
      underscored: true,
    }
  );
  return  PlanValidity;
};

