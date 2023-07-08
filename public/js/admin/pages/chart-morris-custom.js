"use strict";
$(document).ready(function () {
  setTimeout(function () {
    // console.log(document.getElementById("dishData").value);
    var dishData = JSON.parse(
      decodeURIComponent(document.getElementById("dishData").value)
    );
    // console.log(dishData);

    // [ Donut-chart ] Start
    Morris.Donut({
      element: "dish-donut-chart",
      data: dishData,
      colors: ["#1de9b6", "#A389D4", "#04a9f5"],
      resize: true,
      formatter: function (x) {
        return "Số lượng : " + x;
      },
    });

    // console.log(document.getElementById("ingredientData").value);
    var ingredientData = JSON.parse(
      decodeURIComponent(document.getElementById("ingredientData").value)
    );
    // console.log(ingredientData);

    function getRandomColor() {
      var letters = "0123456789ABCDEF";
      var color = "#";
      for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
    }

    var chartColors = ingredientData.map(function (item) {
      return getRandomColor();
    });

    Morris.Donut({
      element: "ingredient-donut-chart",
      data: ingredientData,
      colors: chartColors,
      resize: true,
      formatter: function (x) {
        return "Số lượng : " + x;
      },
    });

    // [ Donut-chart ] end
  }, 700);
});
