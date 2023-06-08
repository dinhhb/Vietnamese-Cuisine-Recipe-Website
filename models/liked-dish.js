const fs = require("fs");
const path = require("path");

const p = path.join(
    path.dirname(process.mainModule.filename),
    "data",
    "liked-dish.json"
  );

module.exports = class LikedDish{
    static addDish(id){
        // lấy danh sách món ăn đã thích
        fs.readFile(p, (err, fileContent) => {
            let likedDish = {dishes: []};
            if (!err){
                likedDish = JSON.parse(fileContent);
            }
                // duyệt qua danh sách => tìm món ăn đã tồn tại
            const existingDishIndex = likedDish.dishes.findIndex(dish => dish.id === id);
            const existingDish = likedDish.dishes[existingDishIndex];
            let updatedDish;

            // thêm món ăn đã thích mới/ tăng số lượng 
            if (existingDish){
                updatedDish = { ...existingDish };
                updatedDish.qty = updatedDish.qty + 1;
                likedDish.dishes = [...likedDish.dishes];
                likedDish.dishes[existingDishIndex] = updatedDish;
            } else {
                updatedDish = { id: id, qty: 1};
                likedDish.dishes = [...likedDish.dishes, updatedDish];
            }
            fs.writeFile(p, JSON.stringify(likedDish), err => {
                console.log(err);
            })
        });
    }
}