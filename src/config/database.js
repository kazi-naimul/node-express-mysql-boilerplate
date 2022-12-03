const config = require('./config');

module.exports = {
    development: {
        username: config.dbUser,
        password: config.dbPass,
        database: config.dbName,
        host: config.dbHost,
        dialect: 'mysql',
        dialectOptions: {
            bigNumberStrings: true,
            useUTC: false, // for reading from database

        },
 
          timezone: '+05:30', 
    },
    test: {
        username: config.dbUser,
        password: config.dbPass,
        database: config.dbName,
        host: config.dbHost,
        dialect: 'mysql',
        dialectOptions: {
            bigNumberStrings: true,
            useUTC: false, // for reading from database

        },
        timezone: '+05:30', 
    },
    production: {
        username: config.dbUser,
        password: config.dbPass,
        database: config.dbName,
        host: config.dbHost,
        port: config.port,
        dialect: 'mysql',
        dialectOptions: {
            bigNumberStrings: true,
            useUTC: false, // for reading from database

        },
        timezone: '+05:30', 

    },
};
