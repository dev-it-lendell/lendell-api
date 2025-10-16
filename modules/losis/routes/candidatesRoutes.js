const express = require("express");
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
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

router.get("/endorsements", (req, res) =>
  CandidatesController.selectEndorsements(req, res)
);

router.post("/endorsement", (req, res) =>
  CandidatesController.insertCandidatesEndorsement(req, res)
);

router.post("/send-report/:id", upload.single('files'), (req, res) =>
  CandidatesController.sendFinalReport(req, res)
);

module.exports = router;
