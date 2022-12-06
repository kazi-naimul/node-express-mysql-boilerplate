const express = require('express');
const ProfileController = require('../controllers/ProfileController');

const router = express.Router();
const auth = require('../middlewares/auth');
const multer = require("multer");

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "registration");
    },
    filename: (req, file, cb) => {
      cb(null,  file.fieldname+'_'+Date.now()+path.extname(file.originalname) );
    },
  });
router.use(multer({storage:fileStorage}).any("images"));

router.use(auth());
const profileController = new ProfileController();
router.post('/address', profileController.addressCurd);
router.put('/address', profileController.addressCurd);
router.get('/address', profileController.addressCurd);
router.delete('/address',  profileController.addressCurd);

router.post('/update-for-activation',  profileController.updateDetailsForActivation);


module.exports = router;
