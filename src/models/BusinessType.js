const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class  BusinessType extends Model {
  
    static associate(models) {
      // define association here
      //  User.belongsTo(models.agency, { foreignKey: 'agency_id', targetKey: 'id' });
    }
  }

   BusinessType.init(
    {
      uuid: DataTypes.UUID,
      label:DataTypes.STRING,
      image:DataTypes.STRING
     
    },

    {
      sequelize,
      modelName: "businesstype",
      underscored: true,
    }
  );
  return  BusinessType;
};

