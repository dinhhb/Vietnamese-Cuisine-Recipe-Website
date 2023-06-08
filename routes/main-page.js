const path = require('path');

const express = require('express');

const mainPageController = require('../controllers/main-page');

const router = express.Router();

router.get('/', mainPageController.getDishes);

router.get('/dishes/:dishId', mainPageController.getDish);

router.get('/add-dish', mainPageController.getAddDish);

router.post('/add-dish', mainPageController.postAddDish);

router.get('/edit-dish/:dishId', mainPageController.getEditDish);

router.post('/edit-dish', mainPageController.postEditDish);

router.get('/add-dish', mainPageController.getAddDish);

router.post('/add-dish', mainPageController.postAddDish);

router.get('/edit-dish/:dishId', mainPageController.getEditDish);

router.post('/edit-dish', mainPageController.postEditDish);

// router.get('/dish-detail', dishController.getDishDetail);

module.exports = router;
