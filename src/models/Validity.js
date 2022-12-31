const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class  Validity extends Model {
  
    static associate(models) {
      // define association here
      //  User.belongsTo(models.agency, { foreignKey: 'agency_id', targetKey: 'id' });
    }
  }

   Validity.init(
    {
     value:DataTypes.INTEGER,
     unit:{
         type:DataTypes.STRING,
         defaultValue:'days'
     }
    },

    {
      sequelize,
      modelName: "validity",
      underscored: true,
    }
  );
  return  Validity;
};

