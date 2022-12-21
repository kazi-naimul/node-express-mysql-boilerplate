const { Model } = require("sequelize");
const { Op } = require("sequelize");

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
      },
      // lastName: DataTypes.STRING,
      // middleName: DataTypes.STRING,
      branch_type_label: DataTypes.STRING,
      branch_type: {
        type: DataTypes.JSON,

        set: function (val) {
          this.setDataValue("branch_type_label", val.label);

          return this.setDataValue("branch_type_id", val.id);
        },
      },
      branch_type_id: {
        type: DataTypes.INTEGER,
      },
      branch_phone_number: DataTypes.STRING,
      branch_sub_type: DataTypes.STRING,
      open_timing: DataTypes.DATE,
      close_timing: DataTypes.DATE,

      business_category: DataTypes.STRING,

      business_activities: {
        type: DataTypes.STRING,
        get: function () {
          const value = this.getDataValue("business_activities")
          return JSON.parse( value ?? '[]');
        },
        set: function (val) {
          console.log('businessacti',val)
          return this.setDataValue("business_activities", JSON.stringify(val));
        },
      },
      order_type: {
        type: DataTypes.STRING,
        defaultValue: "mabliz",
      },

      verified_by_id: DataTypes.INTEGER,
      verified_by_name: DataTypes.STRING,
      verified_time: DataTypes.DATE,
      activated_by_id: DataTypes.INTEGER,
      activated_by_name: DataTypes.STRING,
      activated_time: DataTypes.DATE,

      rejected_by_id: DataTypes.INTEGER,
      rejected_by_name: DataTypes.STRING,
      rejected_time: DataTypes.DATE,

      price_type_label: DataTypes.STRING,
      reject_reasons: DataTypes.STRING,

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
      branch_status: {
        defaultValue: branchStatus.STATUS_INACTIVE,
        type: DataTypes.INTEGER,
      },

      gst_number: DataTypes.STRING,

      gst_image: DataTypes.STRING,

      licence_number: DataTypes.STRING,
      licence_expiry_date: DataTypes.DATEONLY,
      license_image: DataTypes.STRING,

      address: DataTypes.STRING,
      locality: DataTypes.STRING,
      city: DataTypes.STRING,
      zipcode: DataTypes.STRING,
      latitude: DataTypes.FLOAT,
      longitude: DataTypes.FLOAT,
      head_office: { defaultValue: true, type: DataTypes.BOOLEAN },

      fssai_number: DataTypes.STRING,
      fssai_expiry_date: DataTypes.DATEONLY,
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

  Branch.addHook("afterCreate", async (model, options) => {
    console.log({ model, options });
    const { branch_type_id, id, businessId } = model.dataValues;
    if (branch_type_id === 1) {
      Branch.update(
        {
          branch_type: {
            label: "Branch",
            id: 2,
          },
        },
        { where: { id: { [Op.notIn]: [id] }, businessId } }
      );
    }
    const business = await model.getBusiness();
    await business.update(model.dataValues);
    global.io?.sockets.in('vuinodh@gmail.com').emit('new_msg', model.dataValues);

  });

  Branch.addHook("afterUpdate", async (model, options) => {
   
    global.io?.sockets.in('vuinodh@gmail.com').emit('new_msg', model);

  });

  return Branch;
};
