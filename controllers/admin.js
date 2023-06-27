const { body, validationResult } = require('express-validator');

const filterIngredientsAndSteps  = require("../middleware/filterIngredientsAndSteps");

const Dish = require("../models/dish");

exports.getDishManagement = (req, res, next) => {
  const filter = req.query.filter || undefined;
  let query = {};

  if (filter && filter !== 'undefined') {
    // console.log(filter);
    query = {type: filter};
  }
  Dish.find(query)
    .then((dishes) => {
      res.render("admin/dish-management", {
        pageTitle: "Quản lý món ăn",
        dishes: dishes,
        hasDishes: dishes.length > 0,
        path: "/admin/dish-management",
        filter: filter
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getAddDish = (req, res, next) => {
  res.render("admin/edit-dish", {
    pageTitle: "Thêm món ăn",
    path: "/admin/add-dish",
    editing: false,
    hasError: false,
    errorMessage: null,
    validationErrors: []
  });
};

exports.postAddDish = (req, res, next) => {
  const name = req.body.name;
  const image = req.file;
  const type = req.body.type;
  let ingredients = req.body.ingredients || [];
  let steps = req.body.steps || [];
  const requirement = req.body.requirement;
  console.log(image);

  filterIngredientsAndSteps;

  if (!image){
    return res.status(422).render("admin/edit-dish", {
      pageTitle: "Thêm món ăn",
      path: "/admin/add-dish",
      editing: false,
      hasError: true,
      dish: {
        name: name,
        type: type,
        ingredients: ingredients,
        steps: steps,
        requirement: requirement
      },
      errorMessage: 'Hình ảnh có định dạng không hợp lệ.',
      validationErrors: []
    });
  };

  const errors = validationResult(req);
  if (!errors.isEmpty()){
    console.log(errors.array());

    return res.status(422).render("admin/edit-dish", {
      pageTitle: "Thêm món ăn",
      path: "/admin/add-dish",
      editing: false,
      hasError: true,
      dish: {
        name: name,
        image: image,
        ingredients: ingredients,
        steps: steps,
        requirement: requirement
      },
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array()
    });
  }

  const imageUrl = image.path;

  const dish = new Dish({
    name: name,
    image: imageUrl,
    type: type,
    ingredients: ingredients,
    steps: steps,
    requirement: requirement,
  });
  dish
    .save()
    .then((result) => {
      console.log("Created Dish");
      res.redirect("/admin/dish-management");
    })
    .catch((err) => {
      // console.log(err);
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getEditDish = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect("/");
  }

  const dishId = req.params.dishId;
  Dish.findById(dishId)
    .then((dish) => {
      if (!dish) {
        return res.redirect("/");
      }
      res.render("admin/edit-dish", {
        pageTitle: "Sửa món ăn",
        path: "/admin/edit-dish",
        editing: editMode,
        dish: dish,
        hasError: false, 
        errorMessage: null
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);    
    });
};

exports.postEditDish = (req, res, next) => {
  const dishId = req.body.dishId;
  const updatedName = req.body.name;
  const updatedImage = req.file; 
  const updatedType = req.body.type;
  let updatedIngredients = req.body.ingredients || [];
  let updatedSteps = req.body.steps || [];
  const updatedRequirement = req.body.requirement;

  filterIngredientsAndSteps;

  const errors = validationResult(req);
  if (!errors.isEmpty()){
    return res.status(422).render("admin/edit-dish", {
      pageTitle: "Sửa món ăn",
      path: "/admin/edit-dish",
      editing: true,
      hasError: true,
      dish: {
        name: updatedName,
        type: updatedType,
        ingredients: updatedIngredients,
        steps: updatedSteps,
        requirement: updatedRequirement,
        _id: dishId
      },
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array()
    });
  }

  Dish.findById(dishId)
    .then((dish) => {
      dish.name = updatedName;
      if (updatedImage) {
        dish.image = updatedImage.path;

      }
      dish.type = updatedType;
      dish.ingredients = updatedIngredients;
      dish.steps = updatedSteps;
      dish.requirement = updatedRequirement;
      return dish.save();
    })
    .then((result) => {
      console.log("UPDATED DISH");
      res.redirect("/admin/dish-management");
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);    
    });
};

exports.getStatistic = (req, res, next) => {
  res.render("admin/statistic", {
    pageTitle: "Xem thống kê",
    path: "/admin/statistic",
  });
};

exports.deleteDish = (req, res, next) => {
  const dishId = req.params.dishId;
  Dish.findByIdAndRemove(dishId)
    .then(() => {
      // Xóa dishId khỏi cookie
      let favoriteDishIds = req.cookies.favoriteDish || [];
      favoriteDishIds = favoriteDishIds.filter((id) => id !== dishId);
      res.cookie("favoriteDish", favoriteDishIds);
      console.log("DELETED DISH");
      res.status(200).json({message: "Success"});
    })
    .catch((err) => {
      res.status(500).json({message: "Failed"});  
    });
};
