const express = require("express");
const sequelize = require("../config/database");
const UserController = require("../controllers/UserController");
const User = require("../models/User");
const { validateAccessToken, checkWhiteList } = require("../helpers/auth");

const router = express.Router();

router.get("/", validateAccessToken, checkWhiteList, (req, res) =>
  UserController.selectAll(req, res)
);
router.post("/", validateAccessToken, checkWhiteList, (req, res) =>
  UserController.create(req, res)
);

router.get("/:id", validateAccessToken, checkWhiteList, (req, res) =>
  UserController.selectById(req, res)
);
router.put("/:id", validateAccessToken, checkWhiteList, (req, res) =>
  UserController.update(req, res)
);
router.put(
  "/reset-password/:id",
  validateAccessToken,
  checkWhiteList,
  (req, res) => UserController.resetPassword(req, res)
);

module.exports = router;
