"use strict";
$(document).ready(function () {
  setTimeout(function () {
    var dishData = JSON.parse(
      decodeURIComponent(document.getElementById("dishData").value)
    );

    Morris.Donut({
      element: "dish-donut-chart",
      data: dishData,
      colors: function () {
        var chartColors = [];
        for (var i = 0; i < dishData.length; i++) {
          chartColors.push(getRandomColor());
        }
        return chartColors;
      }(),
      resize: true,
      formatter: function (x) {
        return "Số lượng: " + x;
      },
    });

    var ingredientData = JSON.parse(
      decodeURIComponent(document.getElementById("ingredientData").value)
    );

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
        return "Số lượng: " + x;
      },
    });
  }, 700);
});
