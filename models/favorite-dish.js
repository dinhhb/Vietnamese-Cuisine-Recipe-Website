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

            // thêm món ăn đã thích mới/ tăng số lượng 
            if (existingDish){
                updatedDish = { ...existingDish };
                updatedDish.qty = updatedDish.qty + 1;
                favoriteDish.dishes = [...favoriteDish.dishes];
                favoriteDish.dishes[existingDishIndex] = updatedDish;
            } else {
                updatedDish = { id: id, qty: 1};
                favoriteDish.dishes = [...favoriteDish.dishes, updatedDish];
            }
            fs.writeFile(p, JSON.stringify(favoriteDish), err => {
                console.log(err);
            })
        });
    }
}