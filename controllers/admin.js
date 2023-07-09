const { body, validationResult } = require("express-validator");

const Dish = require("../models/dish");

exports.getDishManagement = async (req, res, next) => {
  const filter = req.query.filter || undefined;
  let query = {};

  if (filter && filter !== "undefined") {
    // console.log(filter);
    query = { type: filter };
  }

  try {
    const dishes = await Dish.find(query);
    res.render("admin/dish-management", {
      pageTitle: "Quản lý món ăn",
      dishes: dishes,
      hasDishes: dishes.length > 0,
      path: "/admin/dish-management",
      filter: filter,
      searchTerm: null,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getAddDish = (req, res, next) => {
  res.render("admin/edit-dish", {
    pageTitle: "Thêm món ăn",
    path: "/admin/add-dish",
    editing: false,
    hasError: false,
    errorMessage: null,
    validationErrors: [],
  });
};

exports.postAddDish = async (req, res, next) => {
  const name = req.body.name;
  const image = req.file;
  const type = req.body.type;
  let ingredients = req.body.ingredients || [];
  let steps = req.body.steps || [];
  const requirement = req.body.requirement;
  // console.log(image);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // console.log(errors.array());
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
        requirement: requirement,
      },
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array(),
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

  try {
    const result = await dish.save();
    console.log("Created Dish");
    res.redirect("/admin/dish-management");
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getEditDish = async (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect("/");
  }
  const dishId = req.params.dishId;

  try {
    const dish = await Dish.findById(dishId);
    if (!dish) {
      res.redirect("/");
    }
    res.render("admin/edit-dish", {
      pageTitle: "Sửa món ăn",
      path: "/admin/edit-dish",
      editing: editMode,
      dish: dish,
      hasError: false,
      errorMessage: null,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.postEditDish = async (req, res, next) => {
  const dishId = req.body.dishId;
  const updatedName = req.body.name;
  const updatedImage = req.file;
  const updatedType = req.body.type;
  let updatedIngredients = req.body.ingredients || [];
  let updatedSteps = req.body.steps || [];
  const updatedRequirement = req.body.requirement;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
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
        _id: dishId,
      },
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array(),
    });
  }

  try {
    const dish = await Dish.findById(dishId);
    dish.name = updatedName;
    if (updatedImage) {
      dish.image = updatedImage.path;
    }
    dish.type = updatedType;
    dish.ingredients = updatedIngredients;
    dish.steps = updatedSteps;
    dish.requirement = updatedRequirement;

    const result = await dish.save();
    console.log("UPDATED DISH");
    res.redirect("/admin/dish-management");
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getStatistic = async (req, res, next) => {
  let dishData;
  let ingredientData;
  let ingredientCount;

  try {
    // Nhóm dữ liệu từ collection Dish theo trường $type
    const results = await Dish.aggregate([
      {
        $group: {
          _id: "$type",
          count: { $sum: 1 },
        },
      },
    ]);
    // console.log(results);

    // Chuyển đổi từ results thành dishData để hiển thị dữ liệu trên giao diện người dùng
    dishData = results.map((result) => ({
      value: result.count,
      label: result._id,
    }));
    // console.log(dishData);

    // Nhóm dữ liệu theo trường ingredient và tính tổng số lượng mỗi thành phần
    const results1 = await Dish.aggregate([
      {
        $unwind: "$ingredients",
      },
      {
        $group: {
          _id: "$ingredients",
          count: { $sum: 1 },
        },
      },
    ]);

    ingredientData = results1
      .filter((result) => result.count > 2)
      .map((result) => ({
        value: result.count,
        label: result._id,
      }));

    const dishCount = await Dish.countDocuments();

    // Tính tổng số nguyên liệu
    const results2 = await Dish.aggregate([
      {
        $project: {
          ingredientCount: { $size: "$ingredients" },
        },
      },
      {
        $group: {
          _id: null,
          count: { $sum: "$ingredientCount" },
        },
      },
    ]);

    if (results2.length > 0) {
      ingredientCount = results2[0].count;
    } else {
      ingredientCount = 0;
    }

    res.render("admin/statistic", {
      pageTitle: "Xem thống kê",
      path: "/admin/statistic",
      dishData: JSON.stringify(dishData),
      ingredientData: JSON.stringify(ingredientData),
      dishCount: dishCount,
      ingredientCount: ingredientCount,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.deleteDish = async (req, res, next) => {
  const dishId = req.params.dishId;

  try {
    const dish = await Dish.findByIdAndRemove(dishId);
    // Xóa dishId khỏi cookie
    let favoriteDishIds = req.cookies.favoriteDish || [];
    favoriteDishIds = favoriteDishIds.filter((id) => id !== dishId);
    res.cookie("favoriteDish", favoriteDishIds);
    console.log("DELETED DISH");
    res.status(200).json({ message: "Success" });
  } catch (err) {
    res.status(500).json({ message: "Failed" });
  }
};

exports.searchDishes = async (req, res, next) => {
  const filter = req.query.filter || undefined;
  const searchTerm = req.query.search;
  // console.log(searchTerm);
  const searchRegex = new RegExp(searchTerm, "i");
  let query = { name: searchRegex };
  // console.log(query);

  if (filter && filter !== "undefined") {
    // console.log(filter);
    query = { type: filter, name: searchRegex };
    // console.log(query);
  }

  try {
    // const totalDishes = await Dish.find(query).countDocuments();
    const dishes = await Dish.find(query);

    // console.log(dishes);
    res.render("admin/dish-management", {
      pageTitle: "Quản lý món ăn",
      dishes: dishes,
      hasDishes: dishes.length > 0,
      path: "/admin/dish-management-search",
      filter: filter,
      searchTerm: searchTerm,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
