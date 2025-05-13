const express = require("express");
const InquiriesController = require("../controllers/InquiriesController");

const {
  validateAccessToken,
  checkWhiteList,
} = require("../../../helpers/auth");

const router = express.Router();

router.get("/", (req, res) => InquiriesController.selectAll(req, res));

module.exports = router;
