$(function () {
  $("#form-total").steps({
    headerTag: "h2",
    bodyTag: "section",
    transitionEffect: "fade",
    enableAllSteps: true,
    stepsOrientation: "vertical",
    autoFocus: true,
    transitionEffectSpeed: 500,
    titleTemplate: '<div class="title">#title#</div>',
    labels: {
      previous: "Back Step",
      next: '<i class="zmdi zmdi-arrow-right"></i>',
      finish: '<i class="zmdi zmdi-check"></i>',
      current: "",
    },
  });
});

function readURL(input) {
  if (input.files && input.files[0]) {
    var reader = new FileReader();

    reader.onload = function (e) {
      $("#blah").attr("src", e.target.result).width(150).height(200);
    };

    reader.readAsDataURL(input.files[0]);
  }
}

$(document).ready(function () {
  var i = 2;
  var ingredientIndex = 0;
  var ingredientValues = [];
  var dishForm = document.getElementById("form-register");
  var dish1Ingredient = $('#editing-value1').val().split(",");
  console.log(dish1Ingredient);
  // console.log(dish1Ingredient[1]);
  $("#add-ingredient").html('<i class="fa-solid fa-plus"></i> Thêm');

  if (dish1Ingredient){
   dish1Ingredient.forEach((ingredient, index) => {
      var newFieldset = $("<fieldset>").append(
        $("<input>").attr({
          type: "text",
          name: "ingredient[]",
          placeholder: "Điền nguyên liệu thứ " + (index + 1) + " của bạn",
          value: ingredient
        })
      );
      $("#ingredients").append(newFieldset);
      ingredientValues.push(ingredient);
    ingredientIndex = index + 1;
      console.log(ingredientIndex);
    });

    console.log(ingredientValues);
    $("#add-ingredient").click(function () {
      var newFieldset = $("<fieldset>").append(
        $("<input>").attr({
          type: "text",
          name: "ingredient[]",
          placeholder: "Điền nguyên liệu thứ " + (ingredientIndex + 1) + " của bạn",
        })
      );
    $("#ingredients").append(newFieldset);

    // Lưu giá trị của trường fieldset vào phần tử tiếp theo trong mảng ingredient[]
    var inputElements = $('input[name="ingredient[]"]');

    var inputValue = inputElements.eq(ingredientIndex).val();
    console.log(ingredientIndex);
    inputElements.eq(ingredientIndex + 1).val(inputValue);
    ingredientIndex++;

    ingredientValues.push(inputValue);
    console.log(ingredientValues);
  });


  } else {
    $("#add-ingredient").click(function () {
        var newFieldset = $("<fieldset>").append(
          $("<input>").attr({
            type: "text",
            name: "ingredient[]",
            placeholder: "Điền nguyên liệu thứ " + i++ + " của bạn",
          })
        );
      $("#ingredients").append(newFieldset);
  
  
      // Lưu giá trị của trường fieldset vào phần tử tiếp theo trong mảng ingredient[]
      var inputElements = $('input[name="ingredient[]"]');
  
      var inputValue = inputElements.eq(ingredientIndex).val();
      inputElements.eq(ingredientIndex + 1).val(inputValue);
      ingredientIndex++;
  
      ingredientValues.push(inputValue);
    });
  }
  // console.log(ingredientValues);

  var j = 2;
  var stepIndex = 0;
  var stepValues = [];

  $("#add-step").html('<i class="fa-solid fa-plus"></i> Thêm');
  $("#add-step").click(function () {
    var newFieldset = $("<fieldset>").append(
      $("<input>").attr({
        type: "text",
        name: "step[]",
        placeholder: "Bước " + j++,
      })
    );
    $("#step").append(newFieldset);

    var inputElements1 = $('input[name="step[]"]');

    var inputValue1 = inputElements1.eq(stepIndex).val();
    inputElements1.eq(stepIndex + 1).val(inputValue1);
    stepIndex++;

    stepValues.push(inputValue1);
  });

  var finishLink = $('.actions a[href$="#finish"]');

  finishLink.on("click", function (e) {
    e.preventDefault();

    var editing = $('#editing-value').val() === 'true';

    var action = editing ? '/edit-dish' : '/add-dish';

    var inputElements = $('input[name="ingredient[]"]');
    var lastValue = inputElements.eq(ingredientIndex).val();
    ingredientValues.push(lastValue);

    var inputElements1 = $('input[name="step[]"]');
    var lastValue1 = inputElements1.eq(stepIndex).val();
    stepValues.push(lastValue1);
    // console.log(ingredientValues);
    // console.log(dishForm.name.value);

    // Gửi yêu cầu POST tới '/add-dish' với dữ liệu ingredientValues
    $.ajax({
      url: "/add-dish",
      type: "post",
      data: {
        name: dishForm.name.value,
        image: dishForm.image.value,
        ingredients:  JSON.stringify(ingredientValues),
        steps: JSON.stringify(stepValues),
        requirement: dishForm.requirement.value,
      },
      success: function (response) {
        // Xử lý phản hồi thành công từ server
        console.log("success");
        console.log(ingredientValues);
        // window.location.href = action;
      },
      error: function (xhr, status, error) {
        // Xử lý lỗi khi gửi yêu cầu
        console.log(error);
      },
    });
  });

});

