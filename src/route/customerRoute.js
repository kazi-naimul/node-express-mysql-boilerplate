const express = require('express');
const CustomerController = require('../controllers/CustomerController');

const router = express.Router();

const customerController = new CustomerController();

const auth = require('../middlewares/auth');
// router.use(auth());

router.get('/get-dashboard-ads', customerController.getDashboardAds);




module.exports = router;
