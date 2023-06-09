const Dish = require('../models/dish');
const FavoriteDish = require('../models/favorite-dish');

exports.getDishes = (req, res, next) => {
    Dish.fetchAll(dishes => {
        res.render('main-page/main-page', {
            pageTitle: 'Ẩm thực việt',
            dishes: dishes,
            hasDishes: dishes.length > 0,
            path: '/'
        })
    });
};

exports.getDish = (req, res, next) => {
    const dishId1 = req.params.dishId;
    Dish.findById(dishId1, dish => {
        res.render('main-page/dish-detail', {
            // pageTitle: 'Shop',
            dish: dish,
            path: '/dish-detail'
        })      
    });
};

exports.getFavoriteDish = (req, res, next) => {
    res.render('main-page/favorite-dish', {
        pageTitle: 'Món ăn yêu thích',
        path: '/favorite-dish'
    })  
};

exports.postFavoriteDish = (req, res, next) => {
    const dishId1 = req.body.dishId;
    Dish.findById(dishId1, dish => {
        favoriteDish.addDish(dishId1);
    });
    res.redirect('/favorite-dish');
};
