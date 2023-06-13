module.exports = (req, res, next) => {
  let ingredients = req.body.ingredients || [];
  let steps = req.body.steps || [];

  // Loại bỏ các giá trị null hoặc trống từ mảng ingredients
  ingredients = ingredients.filter(
    (ingredient) => ingredient !== null && ingredient.trim() !== ""
  );
  // Loại bỏ các giá trị null hoặc trống từ mảng steps
  steps = steps.filter((step) => step !== null && step.trim() !== "");

  req.body.ingredients = ingredients;
  req.body.steps = steps;

  next();
};
