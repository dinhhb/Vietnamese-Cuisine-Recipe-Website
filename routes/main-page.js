const path = require('path');

const express = require('express');

const mainPageController = require('../controllers/main-page');

const router = express.Router();

router.get('/', mainPageController.getDishes);

router.get('/dishes/:dishId', mainPageController.getDish);

router.get('/favorite-dish', mainPageController.getFavoriteDish);

router.post('/favorite-dish', mainPageController.postFavoriteDish);

router.post('/delete-favorite-dish', mainPageController.postDeleteFavoriteDish);

// router.get('/clear-favorite-dish', mainPageController.getClearFavoriteDish);

router.get('/dish-by-ingredient', mainPageController.getDishByIngredient);

module.exports = router;
