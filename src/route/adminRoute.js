const express = require('express');
const AdminController = require('../controllers/AdminController');

const router = express.Router();

const adminController = new AdminController();
const auth = require('../middlewares/auth');
router.use(auth(true));




router.get('/get-pending-activation-group', adminController.getActivationGroup);
router.all('/addon',adminController.crudOperations)
router.all('/tax',adminController.crudOperations)
router.all('/validity',adminController.crudOperations)
router.get('/plandetails',(req,res,next)=>{
    req.body ={"tax":{},"validity":{}};
    console.log(req.body)
    next();
},adminController.multipleCrudOperations)

router.post('/plans', adminController.addPlan);
router.get('/plans', adminController.getPlansByBusinessId);

router.put('/plans', adminController.updatePlans);
router.delete('/plans', adminController.deletePlans);
router.delete('/planvalidity', adminController.deleteValidity);

router.post('/subscribe-to-plan',adminController.subscribeToPlan)
router.get('/get-subscribed-plans',adminController.getSubscribedPlans)


module.exports = router;
