const express = require("express");
const { body, validationResult } = require("express-validator");

const adminController = require("../controllers/admin");

const router = express.Router();

router.get("/dish-management", adminController.getDishManagement);

router.get("/add-dish", adminController.getAddDish);

router.post(
  "/add-dish",
  [
    body("name")
      .isString().withMessage("Tên món ăn phải là một chuỗi ít nhất 3 chữ cái")
      .isLength({ min: 3 })
      .trim(),
    body("image").isURL().withMessage("URL không tồn tại"),
    body("ingredients").isEmpty().withMessage("Điền ít nhất 1 nguyên liệu"),
    body("steps").notEmpty().withMessage("Điền ít nhất 1 bước trong quy trình chế biến"),
    // body("ingredients.*")
    //   .isString()
    //   .isLength({ min: 3 })
    //   .trim()
    //   .withMessage("Mỗi nguyên liệu phải là 1 chuỗi ít nhất 3 chữ cái"), // Kiểm tra từng phần tử trong mảng ingredients
    // body("steps.*")
    //   .isString()
    //   .isLength({ min: 3 })
    //   .trim()
    //   .withMessage(
    //     "Mỗi bước trong quy trình chế biến phải là một chuỗi ít nhất 3 chữ cái"
    //   ), // Kiểm tra từng phần tử trong mảng steps
    body("requirement")
      .isString()
      .isLength({ min: 3 })
      .trim()
      .withMessage("Yêu cầu cảm quan phải là một chuỗi ít nhất 3 chữ cái"),
  ],
  adminController.postAddDish
);

router.get("/edit-dish/:dishId", adminController.getEditDish);

router.post(
  "/edit-dish",
  [
    body("name").isString().isLength({ min: 3 }).trim(),
    body("image").isURL(),
    body("ingredients.*").isString().isLength({ min: 3 }).trim(), // Kiểm tra từng phần tử trong mảng ingredients
    body("steps.*").isString().isLength({ min: 3 }).trim(), // Kiểm tra từng phần tử trong mảng steps
    body("requirement").isString().isLength({ min: 3 }).trim(),
  ],
  adminController.postEditDish
);

router.get("/statistic", adminController.getStatistic);

router.post("/delete-dish", adminController.postDeleteDish);

module.exports = router;
