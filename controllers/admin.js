const Dish = require('../models/dish');

exports.getDishManagement = (req, res, next) => {
    Dish.fetchAll(dishes => {
        res.render('admin/dish-management', {
            pageTitle: 'Quản lý món ăn',
            dishes: dishes,
            hasDishes: dishes.length > 0,
            path: '/admin/dish-management'
        })
    });
};

exports.getAddDish = (req, res, next) => {
    res.render('admin/edit-dish', {
        pageTitle: 'Thêm món ăn',
        path: '/admin/add-dish',
        editing: false
    })  
};

exports.postAddDish = (req, res, next) => {
    const name = req.body.name;
    const image = req.body.image;
    const type = req.body.type;
    let ingredients = req.body['ingredient[]'];
    let steps = req.body['step[]'];
    const requirement = req.body.requirement.trim();
    // Loại bỏ các giá trị null hoặc trống từ mảng ingredients
    ingredients = ingredients.filter(ingredient => ingredient !== null && ingredient.trim() !== '');
    // Loại bỏ các giá trị null hoặc trống từ mảng steps
    steps = steps.filter(step => step !== null && step.trim() !== '');
    const dish = new Dish (null, name, image, type, ingredients, steps, requirement);
    dish.save();
    res.redirect('/');
};

exports.getEditDish = (req, res, next) => {
    const editMode = req.query.edit;
    if (!editMode){
        return res.redirect('/');
    }

    const dishId = req.params.dishId;
    Dish.findById(dishId, dish => {
        if (!dish){
            return res.redirect('/');
        }
        res.render('admin/edit-dish', {
            pageTitle: 'Sửa món ăn',
            path: '/admin/edit-dish',
            editing: editMode,
            dish: dish
        });  
    });
};

exports.postEditDish = (req, res, next) => {
    const dishId = req.body.dishId;
    const updatedName = req.body.name;
    const updatedImage = req.body.image;
    const updatedType = req.body.type;
    let updatedIngredients = req.body['ingredient[]'];
    let updatedSteps = req.body['step[]'];
    const updatedRequirement = req.body.requirement.trim();
    // Loại bỏ các giá trị null hoặc trống từ mảng ingredients
    updatedIngredients = updatedIngredients.filter(updatedIngredients => updatedIngredients !== null && updatedIngredients.trim() !== '');
    // Loại bỏ các giá trị null hoặc trống từ mảng steps
    updatedSteps = updatedSteps.filter(updatedSteps => updatedSteps !== null && updatedSteps.trim() !== '');
    const updatedDish = new Dish(dishId, updatedName, updatedImage, updatedType, updatedIngredients, updatedSteps, updatedRequirement);
    updatedDish.save();
    res.redirect('/admin/dish-management');
}

exports.getStatistic = (req, res, next) => {
    res.render('admin/statistic', {
        pageTitle: 'Xem thống kê',
        path: '/admin/statistic'
    })  
}