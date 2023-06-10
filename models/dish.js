const mongodb = require("mongodb");
const getDb = require("../utils/database").getDb;
class Dish {
  constructor(name, image, type, ingredients, steps, requirement, id) {
    this.name = name;
    this.image = image;
    this.type = type;
    this.ingredients = ingredients;
    this.steps = steps;
    this.requirement = requirement;
    this._id = id ? new mongodb.ObjectId(id) : null;
  }

  save() {
    const db = getDb();
    let dbOb;
    if (this._id) {
      // update dish
      dbOb = db
        .collection("dishes")
        .updateOne({ _id: this._id }, { $set: this });
    } else {
      // add dish
      dbOb = db.collection('dishes'.insertOne(this));
    }
    return dbOb
      .then((result) => {
        console.log(result);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  static fetchAll() {
    const db = getDb();
    return db
      .collection("dishes")
      .find()
      .toArray()
      .then((dishes) => {
        console.log(dishes);
        return dishes;
      })
      .catch((err) => {
        console.log(err);
      });
  }

  static findById(dishId) {
    const db = getDb();
    return db
      .collection("dishes")
      .find({ _id: new mongodb.ObjectId(dishId) })
      .next()
      .then((dish) => {
        console.log(dish);
        return dish;
      })
      .catch((err) => {
        console.log(err);
      });
  }
}

module.exports = Dish;
