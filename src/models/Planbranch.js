const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class  Planbranch extends Model {
  
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
            autoIncrement: true
          },
    start_date:DataTypes.DATE,
    end_date:DataTypes.DATE
     
    },

    {
      sequelize,
      modelName: "planbranch",
      underscored: true,
    }
  );
  return  Planbranch;
};

