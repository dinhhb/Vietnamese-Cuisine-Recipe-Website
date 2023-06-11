const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const dishSchema = new Schema({
  name: {
    type: String,
    require: true
  },
  image: {
    type: String, 
    require: true
  }, 
  type: {
    type: String,
    require: true
  },
  ingredients: {
    type: Array,
    require: true
  },
  steps: {
    type: Array,
    require: true
  },
  requirement: {
    type: String,
    require: true
  }
});

module.exports = mongoose.model('Dish', dishSchema);