const express = require("express");
const sequelize = require("../../../config/database");
const CandidatesController = require("../controllers/CandidatesController");

const {
  validateAccessToken,
  checkWhiteList,
} = require("../../../helpers/auth");

const router = express.Router();

router.get("/status", (req, res) =>
  CandidatesController.selectCandidateStatus(req, res)
);

router.post("/endorsement", (req, res) =>
  CandidatesController.insertCandidatesEndorsement(req, res)
);

module.exports = router;
