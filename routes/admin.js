const path = require('path');

const express = require('express');

const adminController = require('../controllers/admin');

const router = express.Router();

router.get('/dish-management', adminController.getDishManagement);

router.get('/add-dish', adminController.getAddDish);

router.post('/add-dish', adminController.postAddDish);

router.get('/edit-dish/:dishId', adminController.getEditDish);

router.post('/edit-dish', adminController.postEditDish);

module.exports = router;
