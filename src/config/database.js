const config = require('./config');

module.exports = {
    development: {
        username: config.dbUser,
        password: config.dbPass,
        database: config.dbName,
        host: config.dbHost,
        port:5432,
        dialect: 'postgres',
        protocol: 'postgres',
        dialectOptions: {
            bigNumberStrings: true,
            ssl: true,
            native:true
        },
 
          timezone: '+05:30', 
    },
    testing: {
        username: config.dbUser,
        password: config.dbPass,
        database: config.dbName,
        host: config.dbHost,
        dialect: 'mysql',
        dialectOptions: {
            bigNumberStrings: true,

        },
        timezone: '+05:30', 
    },
    production: {
        username: config.dbUser,
        password: config.dbPass,
        database: config.dbName,
        host: config.dbHost,
        dialect: 'mysql',
        dialectOptions: {
            bigNumberStrings: true,

        },
        timezone: '+05:30', 

    },
};
