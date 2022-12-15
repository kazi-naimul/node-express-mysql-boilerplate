const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class  Planbranchaddon extends Model {
  
    static associate(models) {
      // define association here
      //  User.belongsTo(models.agency, { foreignKey: 'agency_id', targetKey: 'id' });
    }
  }

   Planbranchaddon.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
          },
value:DataTypes.INTEGER 
    },

    {
      sequelize,
      modelName: "planbranchaddon",
      underscored: true,
    }
  );
  return  Planbranchaddon;
};

