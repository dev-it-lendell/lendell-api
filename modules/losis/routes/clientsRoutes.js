const express = require("express");
const sequelize = require("../../../config/database");
const ClientsController = require("../controllers/ClientsController");

const {
  validateAccessToken,
  checkWhiteList,
} = require("../../../helpers/auth");

const router = express.Router();

router.get("/", (req, res) => ClientsController.selectClient(req, res));
router.get("/supervisor", (req, res) => ClientsController.selectSupervisor(req, res));

module.exports = router;
