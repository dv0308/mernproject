const express = require("express");
const expressValidator = require("express-validator");

const router = express.Router();
const fileUpload = require("../middleware/file-upload");

const getPlaces = require("../controllers/place-controller");

router.get("/:pid", getPlaces.getPlaceById);

router.get("/user/:uid", getPlaces.getPlacesByUserId);

router.post(
  "/",
  fileUpload.single("image"),
  [
    expressValidator.check("title").not().isEmpty(),
    expressValidator.check("description").isLength({ min: 5 }),
    expressValidator.check("address").not().isEmpty(),
  ],
  getPlaces.createPlace
);

router.patch(
  "/:pid",
  [
    expressValidator.check("title").not().isEmpty(),
    expressValidator.check("description").isLength({ min: 5 }),
  ],
  getPlaces.updatePlace
);

router.delete("/:pid", getPlaces.deletePlace);

module.exports = router;
