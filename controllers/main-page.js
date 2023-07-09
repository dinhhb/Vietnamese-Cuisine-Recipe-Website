const Dish = require("../models/dish");
const DISHES_PER_PAGE = 9;

exports.getMainPage = (req, res, next) => {
  res.render("main-page/main-page", {
    pageTitle: "Ẩm thực việt",
    path: "/",
  });
};

exports.getDishes = async (req, res, next) => {
  const page = +req.query.page || 1;
  const filter = req.query.filter || undefined;
  let query = {};

  if (filter && filter !== "undefined") {
    // console.log(filter);
    query = { type: filter };
  }

  try {
    const totalDishes = await Dish.find(query).countDocuments();
    const dishes = await Dish.find(query)
      .skip((page - 1) * DISHES_PER_PAGE)
      .limit(DISHES_PER_PAGE);
    // console.log(dishes);
    res.render("main-page/menu", {
      pageTitle: "Ẩm thực việt",
      dishes: dishes,
      hasDishes: dishes.length > 0,
      path: "/menu",
      currentPage: page,
      hasNextPage: DISHES_PER_PAGE * page < totalDishes,
      hasPreviousPage: page > 1,
      nextPage: page + 1,
      previousPage: page - 1,
      lastPage: Math.ceil(totalDishes / DISHES_PER_PAGE),
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

exports.getDish = async (req, res, next) => {
  const dishId = req.params.dishId;

  try {
    const dish = await Dish.findById(dishId);
    res.render("main-page/dish-detail", {
      // pageTitle: 'Shop',
      dish: dish,
      path: "/dish-detail",
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getFavoriteDish = async (req, res, next) => {
  const favoriteDishIds = req.cookies.favoriteDish;
  const page = +req.query.page || 1;
  const filter = req.query.filter || undefined;
  let query = {};

  if (filter && filter !== "undefined") {
    // console.log(filter);
    query = { type: filter };
  }

  try {
    const dishes = await Dish.find(query);
    const favoriteDishArray = dishes.filter((dish) => {
      return favoriteDishIds.includes(dish._id.toString());
    });
    const totalItems = favoriteDishArray.length;
    const totalPages = Math.ceil(totalItems / DISHES_PER_PAGE);
    const startIndex = (page - 1) * DISHES_PER_PAGE;
    const endIndex = startIndex + DISHES_PER_PAGE;
    const slicedDishes = favoriteDishArray.slice(startIndex, endIndex);

    res.render("main-page/favorite-dish", {
      path: "/favorite-dish",
      dishes: slicedDishes,
      currentPage: page,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
      nextPage: page + 1,
      previousPage: page - 1,
      lastPage: totalPages,
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

exports.postFavoriteDish = async (req, res, next) => {
  const dishId = req.body.dishId;
  let favoriteDishIds = req.cookies.favoriteDish || [];

  // Kiểm tra nếu favoriteDishIds không phải là một mảng, chuyển đổi thành mảng
  if (!Array.isArray(favoriteDishIds)) {
    favoriteDishIds = [favoriteDishIds];
  }
  if (!favoriteDishIds.includes(dishId)) {
    favoriteDishIds.push(dishId);
  }

  try {
    await res.cookie("favoriteDish", favoriteDishIds);
    res.redirect("/favorite-dish");
  } catch (error) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.postDeleteFavoriteDish = async (req, res, next) => {
  const dishId = req.body.dishId;
  let favoriteDishIds = req.cookies.favoriteDish || [];

  // Kiểm tra nếu favoriteDishIds không phải là một mảng, chuyển đổi thành mảng
  if (!Array.isArray(favoriteDishIds)) {
    favoriteDishIds = [favoriteDishIds];
  }
  // Tìm và xóa dishId khỏi mảng favoriteDishIds
  const updatedFavoriteDishIds = favoriteDishIds.filter((id) => id !== dishId);

  try {
    await res.cookie("favoriteDish", updatedFavoriteDishIds);
    res.redirect("/favorite-dish");
  } catch (error) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getDishByIngredient = async (req, res, next) => {
  const ingredient = req.query.ingredient; // Lấy giá trị của tham số truy vấn "ingredient"

  try {
    const dishes = await Dish.find({ ingredients: ingredient });

    // Render trang search-result với danh sách món ăn tìm thấy
    res.render("main-page/dish-by-ingredient", {
      dishes: dishes,
      hasDishes: dishes.length > 0,
      ingredient: ingredient,
    });
  } catch (error) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.searchDishes = async (req, res, next) => {
  const page = +req.query.page || 1;
  const filter = req.query.filter || undefined;
  const searchTerm = req.query.search;
  const searchRegex = new RegExp(searchTerm, "i");
  let query = { name: searchRegex };

  if (filter && filter !== "undefined") {
    // console.log(filter);
    query = { type: filter, name: searchRegex };
  }

  try {
    const totalDishes = await Dish.find(query).countDocuments();
    const dishes = await Dish.find(query)
      .skip((page - 1) * DISHES_PER_PAGE)
      .limit(DISHES_PER_PAGE);

    // console.log(dishes);
    res.render("main-page/menu", {
      pageTitle: "Ẩm thực việt",
      dishes: dishes,
      hasDishes: dishes.length > 0,
      path: "/menu-search",
      currentPage: page,
      hasNextPage: DISHES_PER_PAGE * page < totalDishes,
      hasPreviousPage: page > 1,
      nextPage: page + 1,
      previousPage: page - 1,
      lastPage: Math.ceil(totalDishes / DISHES_PER_PAGE),
      filter: filter,
      searchTerm: searchTerm,
    });
  } catch (error) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
