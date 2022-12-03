const express = require('express');
const authRoute = require('./authRoute');
const adminRoute = require('./adminRoute');

const optionRoute = require('./optionRoute');

const router = express.Router();

const defaultRoutes = [
    {
        path: '/auth',
        route: authRoute,
    },
    {
        path: '/admin',
        route: adminRoute,
    },

    {
        path: '/option',
        route: optionRoute,
    },
];

defaultRoutes.forEach((route) => {
    router.use(route.path, route.route);
});

module.exports = router;
