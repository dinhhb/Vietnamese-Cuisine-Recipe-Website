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
    const dishId = req.params.dishId;
    Dish.findById(dishId, dish => {
        res.render('main-page/dish-detail', {
            // pageTitle: 'Shop',
            dish: dish,
            path: '/dish-detail'
        })      
    });
};

exports.getFavoriteDish = (req, res, next) => {
    FavoriteDish.getFavoriteDish(favoriteDish => {
        Dish.fetchAll(dishes => {
            const favoriteDishArray = [];
            for (dish of dishes){
                const favoriteDishData = favoriteDish.dishes.find(dish1 => dish1.id === dish.id);
                if (favoriteDishData){
                    favoriteDishArray.push(dish);
                }
            }
            // console.log(favoriteDishArray);
            res.render('main-page/favorite-dish', {
                path: '/favorite-dish',
                dishes: favoriteDishArray
            })
        });
    });
}; 

exports.postFavoriteDish = (req, res, next) => {
    const dishId = req.body.dishId;
    FavoriteDish.addDish(dishId);
    res.redirect('/favorite-dish');
};

exports.postDeleteFavoriteDish = (req, res, next) => {
    const dishId = req.body.dishId;
    FavoriteDish.deleteDish(dishId);
    res.redirect('/favorite-dish');
};
