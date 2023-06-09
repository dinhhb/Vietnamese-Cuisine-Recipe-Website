const path = require('path');

const express = require('express');

const mainPageController = require('../controllers/main-page');

const router = express.Router();

router.get('/', mainPageController.getDishes);

router.get('/dishes/:dishId', mainPageController.getDish);

router.get('/favorite-dish', mainPageController.getFavoriteDish);

router.post('/favorite-dish', mainPageController.postFavoriteDish);

module.exports = router;
