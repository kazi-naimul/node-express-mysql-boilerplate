const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class User extends Model {
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

    User.init(
        {
            uuid: DataTypes.UUID,
            name: DataTypes.STRING,
            // lastName: DataTypes.STRING,
            // middleName: DataTypes.STRING,
            dob: DataTypes.STRING,
            idProofType:DataTypes.STRING,
            idProofNumber:DataTypes.STRING,
            idProofImage:DataTypes.STRING,
            addressProofType:DataTypes.STRING,
            addressProofNumber:DataTypes.STRING,
            addressProofImage:DataTypes.STRING,
            photo:DataTypes.STRING,
            email: DataTypes.STRING,
            mpin:DataTypes.STRING,
            business_name: DataTypes.STRING,
            business_phone_number: DataTypes.STRING,
            status: DataTypes.INTEGER,
            address: DataTypes.STRING,
            phone_number: DataTypes.STRING,
            business_type:DataTypes.INTEGER,
            mode:DataTypes.INTEGER,
            mode: {
                type: DataTypes.STRING,
                allowNull: false,
                get() {
                    return this.getDataValue('mode').split(';')
                },
                set(val) {
                   this.setDataValue('mode',val.join(';'));
                },
            },

            // business_type: { 
            //     type: DataTypes.STRING, 
            //     get: function() {
            //         return JSON.parse(this.getDataValue('business_type'));
            //     }, 
            //     set: function(val) {
            //         return this.setDataValue('business_type', JSON.stringify(val));
            //     }
            // },
            gst: DataTypes.STRING,
            address1: DataTypes.STRING,
            city: DataTypes.STRING,
            zipcode: DataTypes.STRING,
            latitude: DataTypes.FLOAT,
            longitude: DataTypes.FLOAT,
            referal_code: DataTypes.STRING,
            whatsapp_communication: DataTypes.BOOLEAN

        },
        {
            sequelize,
            modelName: 'user',
            underscored: true,
        },
    );
    return User;
};
