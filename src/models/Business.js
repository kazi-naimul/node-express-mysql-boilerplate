const { Model } = require("sequelize");
const { businessStatus } = require("./../config/constant");

module.exports = (sequelize, DataTypes) => {
  class Business extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      //  User.belongsTo(models.agency, { foreignKey: 'agency_id', targetKey: 'id' });
    }
  }

  Business.init(
    {
      uuid: DataTypes.UUID,
      business_name: DataTypes.STRING,
      // lastName: DataTypes.STRING,
      // middleName: DataTypes.STRING,
      business_type_label: DataTypes.STRING,
      business_type: {
        type: DataTypes.STRING,
      },
      business_type_id: {
        type: DataTypes.INTEGER,

        set: function (val) {
          this.setDataValue("business_type", val.label);

          return this.setDataValue("business_type", val.id);
        },
      },

      status: DataTypes.INTEGER,

      gst_number: DataTypes.STRING,
      gst_image: DataTypes.STRING,

      license_no: DataTypes.STRING,
      license_expiry: DataTypes.DATE,
      license_image: DataTypes.STRING,
      status: {
        defaultValue: businessStatus.STATUS_INACTIVE,
        type: DataTypes.INTEGER,
      },

      fssai_no: DataTypes.STRING,
      fssai_expiry: DataTypes.DATE,
      fssai_image: DataTypes.STRING,

      
  

      logo: DataTypes.STRING,
      business_card_image: DataTypes.STRING,

      whatsapp_communication: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "business",
      underscored: true,
    }
  );
  return Business;
};
