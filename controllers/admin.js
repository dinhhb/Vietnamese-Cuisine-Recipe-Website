const { body, validationResult } = require('express-validator');

const filterIngredientsAndSteps  = require("../middleware/filterIngredientsAndSteps");

const Dish = require("../models/dish");

exports.getDishManagement = (req, res, next) => {
  Dish.find()
    .then((dishes) => {
      res.render("admin/dish-management", {
        pageTitle: "Quản lý món ăn",
        dishes: dishes,
        hasDishes: dishes.length > 0,
        path: "/admin/dish-management",
      });
    })
    .catch((err) => console.log(err));
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
  const image = req.body.image;
  const type = req.body.type;
  let ingredients = req.body.ingredients || [];
  let steps = req.body.steps || [];
  const requirement = req.body.requirement;

  filterIngredientsAndSteps;

  const errors = validationResult(req);
  if (!errors.isEmpty()){
    console.log(errors.array());

    return res.status(422).render("admin/edit-dish", {
      pageTitle: "Thêm món ăn",
      path: "/admin/edit-dish",
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

  const dish = new Dish({
    name: name,
    image: image,
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
      console.log(err);
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
    .catch((err) => console.log(err));
};

exports.postEditDish = (req, res, next) => {
  const dishId = req.body.dishId;
  const updatedName = req.body.name;
  const updatedImage = req.body.image;
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
        image: updatedImage,
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
      dish.image = updatedImage;
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
    .catch((err) => console.log(err));
};

exports.getStatistic = (req, res, next) => {
  res.render("admin/statistic", {
    pageTitle: "Xem thống kê",
    path: "/admin/statistic",
  });
};

exports.postDeleteDish = (req, res, next) => {
  const dishId = req.body.dishId;
  Dish.findByIdAndRemove(dishId)
    .then(() => {
      // Xóa dishId khỏi cookie
      let favoriteDishIds = req.cookies.favoriteDish || [];
      favoriteDishIds = favoriteDishIds.filter((id) => id !== dishId);
      res.cookie("favoriteDish", favoriteDishIds);
      console.log("DELETED DISH");
      res.redirect("/admin/dish-management");
    })
    .catch((err) => console.log(err));
};
