const express = require("express");
const expressValidator = require("express-validator");

const usersController = require("../controllers/user-controller");
const fileUpload = require("../middleware/file-upload");

const router = express.Router();

router.get("/", usersController.getUsers);

router.post(
  "/signup",
  fileUpload.single("image"),
  [
    expressValidator.check("name").not().isEmpty(),
    expressValidator.check("email").isEmail(),
    expressValidator.check("password").isLength({ min: 5 }),
  ],
  usersController.signup
);

router.post(
  "/login",
  [
    expressValidator.check("email").isEmail(),
    expressValidator.check("password").isLength({ min: 5 }),
  ],
  usersController.login
);

module.exports = router;
