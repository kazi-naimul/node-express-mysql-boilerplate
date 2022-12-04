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
      business_type_label:DataTypes.STRING,
      business_type_id: {
        type: DataTypes.INTEGER,
      
        set: function (val) {
            this.setDataValue("business_type_label", val.label)
         
          return  this.setDataValue('business_type_id',val.id);
        },
      },

      status: DataTypes.INTEGER,

      gst_number: DataTypes.STRING,
      gst_image: DataTypes.TEXT("long"),

      license_no: DataTypes.STRING,
      license_expiry: DataTypes.DATE,
      license_image: DataTypes.TEXT("long"),
      status: {
        defaultValue: businessStatus.STATUS_INACTIVE,
        type: DataTypes.INTEGER,
      },

      fssai_no: DataTypes.STRING,
      fssai_expiry: DataTypes.DATE,
      fssai_image: DataTypes.TEXT("long"),
      business_card_image: {
          defaultValue:"",
        type: DataTypes.TEXT("long"),
        allowNull: false,
        get() {
          return this.getDataValue("business_image")?.split(";");
        },
        set(val) {
          this.setDataValue("business_image", val.join(";"));
        },
      },

      logo: DataTypes.TEXT("long"),
      business_card_image: DataTypes.TEXT("long"),


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
