const path = require('path');

const express = require('express');

const adminController = require('../controllers/admin');

const router = express.Router();

router.get('/dish-management', adminController.getDishManagement);

router.get('/dish-verification', adminController.getDishVerification);

router.get('/account-management', adminController.getAccountManagement);

module.exports = router;
