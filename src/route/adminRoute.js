const express = require('express');
const AdminController = require('../controllers/AdminController');

const router = express.Router();

const adminController = new AdminController();
const auth = require('../middlewares/auth');
router.use(auth(true));




router.get('/get-pending-activation-group', adminController.getActivationGroup);




module.exports = router;
