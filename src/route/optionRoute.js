const express = require('express');
const OptionController = require('../controllers/OptionController');

const router = express.Router();

const optionController = new OptionController();


router.post('/get-fields', optionController.getFields);




module.exports = router;
