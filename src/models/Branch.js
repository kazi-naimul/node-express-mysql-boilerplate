const { Model } = require("sequelize");

const { branchStatus } = require("./../config/constant");
const { differenceInMinutes } = require("date-fns");
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
            ? this.setDataValue('branch_name',val)
            : this.setDataValue('branch_name',this.getDataValue("locality") + " branch");
        },
      },
      // lastName: DataTypes.STRING,
      // middleName: DataTypes.STRING,
      branch_type: DataTypes.STRING,
      branch_phone_number: DataTypes.STRING,
      branch_sub_type: DataTypes.STRING,
      open_timing: DataTypes.DATE,
      close_timing: DataTypes.DATE,

      business_category: DataTypes.STRING,

      business_activities: {
        type: DataTypes.STRING,
        get() {
          return this.getDataValue("business_activities")?.split(";");
        },
        set(val) {
          this.setDataValue("business_activities", val.join(";"));
        },
      },
      order_type: {
        type: DataTypes.STRING,
        defaultValue: "mabliz",
      },

      price_type_label: DataTypes.STRING,
      price_type_id: {
        type: DataTypes.INTEGER,
      },
      price_type: {
        type: DataTypes.STRING,

        set: function (val) {
          this.setDataValue("price_type_label", val.label);

          return this.setDataValue("price_type_id", val.id);
        },
      },

      business_timings: {
        type: DataTypes.TEXT,
        get: function () {
          console.log(this.getDataValue("business_timings"));
          return JSON.parse(this.getDataValue("business_timings") || "{}");
        },
        set: function (value) {
          // this.setDataValue('open_timing',value[0].time[0].start_time);
          // this.setDataValue('open_timing',value[0].time[value[0].time.length-1].end_time);

          this.setDataValue("business_timings", JSON.stringify(value || {}));
        },
      },

      is_closed: DataTypes.BOOLEAN,
      time_distance_from_activation: {
        type: DataTypes.VIRTUAL,
        get() {
          console.log(this.getDataValue("createdAt"));
          return differenceInMinutes(
            new Date(),
            this.getDataValue("createdAt")
          );
        },
      },
      status: {
        defaultValue: branchStatus.STATUS_INACTIVE,
        type: DataTypes.INTEGER,
      },

      gst_number: DataTypes.STRING,
      gst_image: DataTypes.STRING,

      license_no: DataTypes.STRING,
      license_expiry: DataTypes.DATE,
      license_image: DataTypes.STRING,

      address: DataTypes.STRING,
      locality: DataTypes.STRING,
      city: DataTypes.STRING,
      zipcode: DataTypes.STRING,
      latitude: DataTypes.FLOAT,
      longitude: DataTypes.FLOAT,
      head_office: { defaultValue: true, type: DataTypes.BOOLEAN },

      fssai_no: DataTypes.STRING,
      fssai_expiry: DataTypes.DATE,
      fssai_image: DataTypes.STRING,
      branch_photo: DataTypes.STRING,
      business_card_image: DataTypes.STRING,
      sign_board_image: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "branch",
      underscored: true,
    }
  );
  return Branch;
};
