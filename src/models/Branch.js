const { Model } = require("sequelize");

const { branchStatus } = require("./../config/constant");

module.exports = (sequelize, DataTypes) => {
  class Branch extends Model {
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

  Branch.init(
    {
      uuid: DataTypes.UUID,
      branch_name: {
        type: DataTypes.STRING,
        set(val) {
          val
            ? val
            : this.setDataValue(this.getDataValue("locality") + " branch");
        },
      },
      // lastName: DataTypes.STRING,
      // middleName: DataTypes.STRING,
      branch_type: DataTypes.STRING,
branch_phone_number:DataTypes.STRING,
      branch_sub_type: DataTypes.STRING,
      open_timing: DataTypes.DATE,
      close_timing: DataTypes.DATE,
      is_closed: DataTypes.BOOLEAN,

      status: {
        defaultValue: branchStatus.STATUS_INACTIVE,
        type: DataTypes.INTEGER,
      },

      gst_number: DataTypes.STRING,
      gst_image: DataTypes.TEXT("long"),

      license_no: DataTypes.STRING,
      license_expiry: DataTypes.DATE,
      license_image: DataTypes.TEXT("long"),

      address: DataTypes.STRING,
      locality: DataTypes.STRING,
      city: DataTypes.STRING,
      zipcode: DataTypes.STRING,
      latitude: DataTypes.FLOAT,
      longitude: DataTypes.FLOAT,
      head_office: {defaultValue:true,
        type:DataTypes.BOOLEAN},
      divisions: {
        type: DataTypes.STRING,
        get() {
          return this.getDataValue("divisions").split(";");
        },
        set(val) {
          this.setDataValue("divisions", val.join(";"));
        },
      },

      fssai_no: DataTypes.STRING,
      fssai_expiry: DataTypes.DATE,
      fssai_image: DataTypes.TEXT("long"),
      business_image: {
        type: DataTypes.TEXT("long"),
        get() {
          return this.getDataValue("business_image")?.split(";");
        },
        set(val) {
          this.setDataValue("business_image", val.join(";"));
        },
      },
    },
    {
      sequelize,
      modelName: "branch",
      underscored: true,
    }
  );
  return Branch;
};
