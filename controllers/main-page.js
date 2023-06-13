const Dish = require("../models/dish");

exports.getDishes = (req, res, next) => {
  Dish.find()
    .then((dishes) => {
      // console.log(dishes);
      res.render("main-page/main-page", {
        pageTitle: "Ẩm thực việt",
        dishes: dishes,
        hasDishes: dishes.length > 0,
        path: "/",
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getDish = (req, res, next) => {
  const dishId = req.params.dishId;
  Dish.findById(dishId).then((dish) => {
    res.render("main-page/dish-detail", {
      // pageTitle: 'Shop',
      dish: dish,
      path: "/dish-detail",
    });
  }).catch((err) => {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);    
  });
};

exports.getFavoriteDish = (req, res, next) => {
  const favoriteDishIds = req.cookies.favoriteDish;
  console.log(favoriteDishIds);
  Dish.find()
    .then((dishes) => {
      const favoriteDishArray = dishes.filter((dish) => {
        // So sánh String của favoriteDishIds với String của dish._id
        return favoriteDishIds.includes(dish._id.toString());
      });
      res.render("main-page/favorite-dish", {
        path: "/favorite-dish",
        dishes: favoriteDishArray,
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);    
    });
};

exports.postFavoriteDish = async (req, res, next) => {
  try {
    const dishId = req.body.dishId;
    let favoriteDishIds = req.cookies.favoriteDish || [];

    // Kiểm tra nếu favoriteDishIds không phải là một mảng, chuyển đổi thành mảng
    if (!Array.isArray(favoriteDishIds)) {
      favoriteDishIds = [favoriteDishIds];
    }

    if (!favoriteDishIds.includes(dishId)) {
      favoriteDishIds.push(dishId);
    }

    await res.cookie("favoriteDish", favoriteDishIds);
    res.redirect("/favorite-dish");
  } catch (error) {
    const err = new Error(error);
    err.httpStatusCode = 500;
    return next(err);
  }
};

exports.postDeleteFavoriteDish = async (req, res, next) => {
  try {
    const dishId = req.body.dishId;
    let favoriteDishIds = req.cookies.favoriteDish || [];

    // Kiểm tra nếu favoriteDishIds không phải là một mảng, chuyển đổi thành mảng
    if (!Array.isArray(favoriteDishIds)) {
      favoriteDishIds = [favoriteDishIds];
    }

    // Tìm và xóa dishId khỏi mảng favoriteDishIds
    const updatedFavoriteDishIds = favoriteDishIds.filter((id) => id !== dishId);

    await res.cookie("favoriteDish", updatedFavoriteDishIds);
    res.redirect("/favorite-dish");
  } catch (error) {
    const err = new Error(error);
    err.httpStatusCode = 500;
    return next(err);
  }
};


// exports.getClearFavoriteDish = (req, res, next) => {
//   res.clearCookie("favoriteDish");
//   res.redirect("/");
// };

exports.getDishByIngredient = (req, res, next) => {
  const ingredient = req.query.ingredient; // Lấy giá trị của tham số truy vấn "ingredient"

  Dish.find({ ingredients: ingredient })
    .then((dishes) => {
      // Render trang search-result với danh sách món ăn tìm thấy
      res.render("main-page/dish-by-ingredient", {
        dishes: dishes,
        hasDishes: dishes.length > 0,
        ingredient: ingredient,
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);    
    });
};
