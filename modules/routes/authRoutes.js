const express = require("express");
const AuthController = require("../controllers/AuthController");
const { validateAccessToken, checkWhiteList } = require("../../helpers/auth");

const router = express.Router();

router.post("/login", AuthController.login);
router.post(
  "/logout",
  validateAccessToken,
  checkWhiteList,
  AuthController.logout
);

module.exports = router;
