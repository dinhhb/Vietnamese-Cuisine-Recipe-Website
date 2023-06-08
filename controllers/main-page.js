const Dish = require('../models/dish');
const LikedDish = require('../models/liked-dish');

exports.getDishes = (req, res, next) => {
    Dish.fetchAll(dishes => {
        res.render('main-page/main-page', {
            pageTitle: 'Ẩm thực việt',
            dishes1: dishes,
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
            dish1: dish,
            path: '/dish-detail',
            ingredientsArray: JSON.parse(dish.ingredients),
            stepsArray: JSON.parse(dish.steps)
        })      
    });
};
