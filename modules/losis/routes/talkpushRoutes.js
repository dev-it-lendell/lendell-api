const express = require("express");
const sequelize = require("../../../config/database");
const TalkpushController = require("../controllers/TalkpushController");

const {
  validateAccessToken,
  checkWhiteList,
} = require("../../../helpers/auth");

const router = express.Router();

router.get("/candidates", (req, res) =>
  TalkpushController.getCandidates(req, res)
);

router.get("/candidates-by-status", (req, res) =>
  TalkpushController.getCandidatesByStatus(req, res)
);

router.get("/candidates-by-status-without-filter", (req, res) =>
  TalkpushController.getCandidatesByStatusWithoutFilter(req, res)
);

router.get("/folders", (req, res) => TalkpushController.getFolders(req, res));

module.exports = router;
