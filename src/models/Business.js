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
      inital_branch_details:DataTypes.JSON,
      business_type: {
        type: DataTypes.JSON,
        set: function (val) {
          console.log('vinodh',val,typeof val);
          this.setDataValue("business_type_label", val.label);

          return this.setDataValue("business_type_id", val.id);
        },
      },
      business_type_id: {
        type: DataTypes.INTEGER,

      
      },

      business_status:  {
        defaultValue: businessStatus.STATUS_INACTIVE,
        type: DataTypes.INTEGER,
      },
      gst_number: DataTypes.STRING,
      gst_image: DataTypes.STRING,

      licence_number: DataTypes.STRING,
      licence_expiry_date: DataTypes.DATEONLY,
      license_image: DataTypes.STRING,
     

      fssai_number: DataTypes.STRING,
      fssai_expiry_date: DataTypes.DATEONLY,
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
  Business.addHook("afterCreate", async (model, options) => {
    
    const branchData =await model.createBranch(model.inital_branch_details)
await model.update({ ...model, inital_branch_details: "" });
   
  });

  return Business;
};
