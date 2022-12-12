const express = require('express');
const ProfileController = require('../controllers/ProfileController');

const router = express.Router();
const auth = require('../middlewares/auth');





// router.use(auth());
const profileController = new ProfileController();
router.all('/user/:target', profileController.curdUserAssociated);
router.all('/user/:target1/:target1Id', profileController.curdUserAssociatedTwoTargets);

router.all('/user/:target1/:target1Id/:target2', profileController.curdUserAssociatedTwoTargets);

router.all('/user/:target1/:target1Id/:target2/:target2Id', profileController.curdUserAssociatedTwoTargets);

// router.all('/:target', profileController.curdUserAssociated);
// router.all('/:target1/:target1Id', profileController.curdUserAssociatedTwoTargets);

// router.all('/:target1/:target1Id/:target2', profileController.curdUserAssociatedTwoTargets);
router.all('/businesstype', profileController.curdUserAssociatedTwoTargets);

router.all('/businesstype/:sourceId/:target1/:target1Id/:target2/', profileController.curdUserAssociatedTwoTargets);
router.all('/businesstype/:sourceId', profileController.curdUserAssociatedTwoTargets);
router.all('/businesstype/:sourceId/:target1', profileController.curdUserAssociatedTwoTargets);
router.all('/businesstype/:sourceId/:target1/:target1Id', profileController.curdUserAssociatedTwoTargets);

router.all('/businesstype/:sourceId/:target1/:target1Id/:target2/:target2Id', profileController.curdUserAssociatedTwoTargets);

router.post('/update-for-activation',  profileController.updateDetailsForActivation);


module.exports = router;
