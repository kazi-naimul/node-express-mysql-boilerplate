const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class  Businesstype extends Model {
  
    static associate(models) {
      // define association here
      //  User.belongsTo(models.agency, { foreignKey: 'agency_id', targetKey: 'id' });
    }
  }

   Businesstype.init(
    {
      uuid: DataTypes.UUID,
     
    },

    {
      sequelize,
      modelName: "businesstype",
      underscored: true,
    }
  );
  return  Businesstype;
};

