const express = require('express');
const ProfileController = require('../controllers/ProfileController');

const router = express.Router();
const auth = require('../middlewares/auth');





router.use(auth());
const profileController = new ProfileController();
router.all('/user/:target', profileController.curdUserAssociated);


router.post('/update-for-activation',  profileController.updateDetailsForActivation);


module.exports = router;
