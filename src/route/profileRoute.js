const express = require('express');
const ProfileController = require('../controllers/ProfileController');

const router = express.Router();
const auth = require('../middlewares/auth');
router.use(auth());
const profileController = new ProfileController();
router.post('/address', profileController.addressCurd);
router.put('/address', profileController.addressCurd);
router.get('/address', profileController.addressCurd);
router.delete('/address',  profileController.addressCurd);



module.exports = router;
