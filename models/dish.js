const fs = require("fs");
const path = require("path");

const FavoriteDish = require('./favorite-dish');

const p = path.join(
    path.dirname(process.mainModule.filename),
    "data",
    "dishes.json"
  );

const getDishesFromFile = cb => {
    fs.readFile(p, (err, fileContent) => {
        if (err){
            cb([]);
        }
        else {
            cb(JSON.parse(fileContent));
        }
    });
};

module.exports = class Dish {
  constructor(id, name, image, type, ingredients, steps, requirement) {
    this.id = id;
    this.name = name;
    this.image = image;
    this.type = type;
    this.ingredients = ingredients;
    this.steps = steps;
    this.requirement = requirement;
  }

  save() {
    console.log(this.id);
    getDishesFromFile(dishes => {
      // edit mon an
      if (this.id){
        const existingDishIndex = dishes.findIndex(dish => dish.id === this.id);
        const updatedDishes = [...dishes];
        updatedDishes[existingDishIndex] = this;
        fs.writeFile(p, JSON.stringify(updatedDishes), err => {
          console.log(err);
        });
      
      // add mon an
      } else {
          this.id = Math.random().toString();
          dishes.push(this);
          fs.writeFile(p, JSON.stringify(dishes), err => {
            console.log(err);
          })
      }
    });
  }

  static deleteById(id){
    getDishesFromFile(dishes => {
      const updatedDishes = dishes.filter(dish => dish.id !== id);
      fs.writeFile(p, JSON.stringify(updatedDishes), err => {
        if (!err) {
          FavoriteDish.deleteDish(id);
        }
      })
    })
  }

  static fetchAll(cb) {
    getDishesFromFile(cb);
  }

  static findById(id, cb){
    getDishesFromFile(dishes => {
      const dish = dishes.find(p => p.id === id);
      cb(dish);
    });
  }
};
