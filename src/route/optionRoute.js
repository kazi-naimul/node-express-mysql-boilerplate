const express = require('express');
const OptionController = require('../controllers/OptionController');

const router = express.Router();

const optionController = new OptionController();


router.get('/get-fields', optionController.getFields);




module.exports = router;
