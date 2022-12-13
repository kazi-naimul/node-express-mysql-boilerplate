const express = require('express');
const AdminController = require('../controllers/AdminController');

const router = express.Router();

const adminController = new AdminController();
const auth = require('../middlewares/auth');
// router.use(auth(true));




router.get('/get-pending-activation-group', adminController.getActivationGroup);
router.all('/addon',adminController.crudOperations)
router.post('/plans', adminController.addPlan);
router.get('/plans', adminController.getPlansByBusinessId);

router.put('/plans', adminController.updatePlans);
router.delete('/plans', adminController.deletePlans);
router.delete('/planvalidity', adminController.deleteValidity);


module.exports = router;
