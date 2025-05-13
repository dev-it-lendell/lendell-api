const express = require("express");
const sequelize = require("../../../config/database");
const UsersController = require("../controllers/UsersController");
const User = require("../models/User");
const {
  validateAccessToken,
  checkWhiteList,
} = require("../../../helpers/auth");

const router = express.Router();

router.get("/", validateAccessToken, checkWhiteList, (req, res) =>
  UsersController.selectAll(req, res)
);
router.post("/", validateAccessToken, checkWhiteList, (req, res) =>
  UsersController.create(req, res)
);

router.get("/:id", validateAccessToken, checkWhiteList, (req, res) =>
  UsersController.selectById(req, res)
);
router.put("/:id", validateAccessToken, checkWhiteList, (req, res) =>
  UsersController.update(req, res)
);
router.put(
  "/reset-password/:id",
  validateAccessToken,
  checkWhiteList,
  (req, res) => UsersController.resetPassword(req, res)
);

module.exports = router;
