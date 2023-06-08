const fs = require("fs");
const path = require("path");

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
  constructor(id, name, image, ingredients, steps, requirement) {
    this.id = id;
    this.name = name;
    this.image = image;
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
