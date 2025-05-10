const express = require("express");
const DepartmentController = require("../controllers/DepartmentController");
const { validateAccessToken, checkWhiteList } = require("../helpers/auth");

const router = express.Router();

router.get("/", validateAccessToken, checkWhiteList, (req, res) =>
  DepartmentController.selectAll(req, res)
);
router.post("/", validateAccessToken, checkWhiteList, (req, res) =>
  DepartmentController.create(req, res)
);

router.get("/:id", validateAccessToken, checkWhiteList, (req, res) =>
  DepartmentController.selectById(req, res)
);
router.put("/:id", validateAccessToken, checkWhiteList, (req, res) =>
  DepartmentController.update(req, res)
);

module.exports = router;
