const Dish = require("../models/dish");

exports.getDishManagement = (req, res, next) => {
  Dish.fetchAll().then((dishes) => {
    res.render("admin/dish-management", {
      pageTitle: "Quản lý món ăn",
      dishes: dishes,
      hasDishes: dishes.length > 0,
      path: "/admin/dish-management",
    });
  });
};

exports.getAddDish = (req, res, next) => {
  res.render("admin/edit-dish", {
    pageTitle: "Thêm món ăn",
    path: "/admin/add-dish",
    editing: false,
  });
};

exports.postAddDish = (req, res, next) => {
  const name = req.body.name;
  const image = req.body.image;
  const type = req.body.type;
  let ingredients = req.body["ingredient[]"];
  let steps = req.body["step[]"];
  const requirement = req.body.requirement.trim();
  // Loại bỏ các giá trị null hoặc trống từ mảng ingredients
  ingredients = ingredients.filter(
    (ingredient) => ingredient !== null && ingredient.trim() !== ""
  );
  // Loại bỏ các giá trị null hoặc trống từ mảng steps
  steps = steps.filter((step) => step !== null && step.trim() !== "");
  const dish = new Dish(name, image, type, ingredients, steps, requirement);
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
  Dish.findById(dishId).then((dish) => {
    if (!dish) {
      return res.redirect("/");
    }
    res.render("admin/edit-dish", {
      pageTitle: "Sửa món ăn",
      path: "/admin/edit-dish",
      editing: editMode,
      dish: dish,
    });
  });
};

exports.postEditDish = (req, res, next) => {
  const dishId = req.body.dishId;
  const updatedName = req.body.name;
  const updatedImage = req.body.image;
  const updatedType = req.body.type;
  let updatedIngredients = req.body["ingredient[]"];
  let updatedSteps = req.body["step[]"];
  const updatedRequirement = req.body.requirement.trim();
  // Loại bỏ các giá trị null hoặc trống từ mảng ingredients
  updatedIngredients = updatedIngredients.filter(
    (updatedIngredients) =>
      updatedIngredients !== null && updatedIngredients.trim() !== ""
  );
  // Loại bỏ các giá trị null hoặc trống từ mảng steps
  updatedSteps = updatedSteps.filter(
    (updatedSteps) => updatedSteps !== null && updatedSteps.trim() !== ""
  );
  const updatedDish = new Dish(
    updatedName,
    updatedImage,
    updatedType,
    updatedIngredients,
    updatedSteps,
    updatedRequirement,
    dishId
  );
  updatedDish
    .save()
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
  Dish.deleteById(dishId)
    .then(() => {
      // Xóa dishId khỏi cookie
      let favoriteDishIds = req.cookies.favoriteDish || [];
      favoriteDishIds = favoriteDishIds.filter((id) => id !== dishId);
      res.cookie('favoriteDish', favoriteDishIds);
      console.log('DELETED DISH');
      res.redirect('/admin/dish-management');
    })
    .catch((err) => console.log(err));
};

