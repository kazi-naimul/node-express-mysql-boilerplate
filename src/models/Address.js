const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class  Address extends Model {
  
    static associate(models) {
      // define association here
       Address.belongsTo(models.user);
       models.user.hasMany(Address);
    }
  }

   Address.init(
    {
      uuid: DataTypes.UUID,
      "house_no":DataTypes.STRING,
      'building_name':DataTypes.STRING,
      'floor_no':DataTypes.STRING,
      'flat_no':DataTypes.STRING,
      'street1':DataTypes.STRING,
      'street2':DataTypes.STRING,
      'city':DataTypes.STRING,
      'zipcode':DataTypes.STRING,
      'state':DataTypes.STRING,
      'country':DataTypes.STRING,
      'contact_name':DataTypes.STRING,
      'contact_phone_number':DataTypes.STRING,
      'name':DataTypes.STRING

    },



    {
      sequelize,
      modelName: "address",
      underscored: true,
    }
  );
  return  Address;
};

