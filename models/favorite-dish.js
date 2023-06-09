const fs = require("fs");
const path = require("path");

const p = path.join(
    path.dirname(process.mainModule.filename),
    "data",
    "favorite-dish.json"
  );

module.exports = class favoriteDish{
    static addDish(id){
        // lấy danh sách món ăn đã thích
        fs.readFile(p, (err, fileContent) => {
            let favoriteDish = {dishes: []};
            if (!err){
                favoriteDish = JSON.parse(fileContent);
            }
                // duyệt qua danh sách => tìm món ăn đã tồn tại
            const existingDishIndex = favoriteDish.dishes.findIndex(dish => dish.id === id);
            const existingDish = favoriteDish.dishes[existingDishIndex];
            let updatedDish;

            if (!existingDish){
                updatedDish = { id: id};
                favoriteDish.dishes = [...favoriteDish.dishes, updatedDish];
            } 
            fs.writeFile(p, JSON.stringify(favoriteDish), err => {
                console.log(err);
            })
        });
    }

    static deleteDish(id){
        fs.readFile(p, (err, fileContent) => {
            if (err){
                return;
            }
            const updatedFavoriteDish = { ...JSON.parse(fileContent) };
            // const dish = updatedFavoriteDish.dishes.find(dish => dish.id === id);
            // const dishQty = dish.qty;
            updatedFavoriteDish.dishes = updatedFavoriteDish.dishes.filter(dish => dish.id !== id);
            fs.writeFile(p, JSON.stringify(updatedFavoriteDish), err => {
                console.log(err);
            })
        })
    }

    static getFavoriteDish(cb){
        fs.readFile(p, (err, fileContent) => {
            const favoriteDish = JSON.parse(fileContent);
            if (err){
                cb(null);
            } else {
                cb(favoriteDish);
            }
        });
    }
};