const express = require('express');
const CustomerController = require('../controllers/CustomerController');

const router = express.Router();

const customerController = new CustomerController();


router.get('/get-dashboard-ads', customerController.getDashboardAds);




module.exports = router;
