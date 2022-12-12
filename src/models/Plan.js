const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Plan extends Model {
    static associate(models) {
      // define association here
      //  User.belongsTo(models.agency, { foreignKey: 'agency_id', targetKey: 'id' });
    }
  }

  Plan.init(
    {
      plan_type: DataTypes.STRING,
      users: DataTypes.INTEGER,
      tax: DataTypes.FLOAT,
      tax_inclusive: DataTypes.BOOLEAN,
      access: {
        type: DataTypes.TEXT,

        allowNull: false,
        get() {
          return this.getDataValue("access")?.split(";");
        },
        set(val) {
          this.setDataValue("access", val.join(";"));
        },
      },
    },

    {
      sequelize,
      modelName: "plan",
      underscored: true,
    }
  );
  return Plan;
};
