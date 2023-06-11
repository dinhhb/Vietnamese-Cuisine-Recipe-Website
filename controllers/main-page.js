const Dish = require("../models/dish");

exports.getDishes = (req, res, next) => {
  Dish.fetchAll().then((dishes) => {
    res.render("main-page/main-page", {
      pageTitle: "Ẩm thực việt",
      dishes: dishes,
      hasDishes: dishes.length > 0,
      path: "/",
    });
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
  });
};

exports.getFavoriteDish = (req, res, next) => {
  const favoriteDishIds = req.cookies.favoriteDish;
  console.log(favoriteDishIds);
  Dish.fetchAll()
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
      console.log(err);
      res.redirect("/");
    });
};


exports.postFavoriteDish = (req, res, next) => {
  const dishId = req.body.dishId;
  let favoriteDishIds = req.cookies.favoriteDish || []; // Mặc định là một mảng rỗng nếu cookie chưa tồn tại

  // Kiểm tra nếu favoriteDishIds không phải là một mảng, chuyển đổi thành mảng
  if (!Array.isArray(favoriteDishIds)) {
    favoriteDishIds = [favoriteDishIds];
  }

  if (!favoriteDishIds.includes(dishId)) {
    favoriteDishIds.push(dishId);
  }
  res.cookie("favoriteDish", favoriteDishIds);
  res.redirect("/favorite-dish");
};



exports.postDeleteFavoriteDish = (req, res, next) => {
  const dishId = req.body.dishId;
  let favoriteDishIds = req.cookies.favoriteDish || [];

  // Kiểm tra nếu favoriteDishIds không phải là một mảng, chuyển đổi thành mảng
  if (!Array.isArray(favoriteDishIds)) {
    favoriteDishIds = [favoriteDishIds];
  }

  // Tìm và xóa dishId khỏi mảng favoriteDishIds
  const updatedFavoriteDishIds = favoriteDishIds.filter(
    (id) => id !== dishId
  );

  // Cập nhật cookie với mảng favoriteDishIds đã được xóa
  res.cookie("favoriteDish", updatedFavoriteDishIds);
  res.redirect("/favorite-dish");
};

exports.getClearFavoriteDish = (req, res, next) => {
  res.clearCookie('favoriteDish');
  res.redirect('/'); // Hoặc định tuyến đến trang khác sau khi xóa cookie
};