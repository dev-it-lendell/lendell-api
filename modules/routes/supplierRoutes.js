const express = require("express");
const SupplierController = require("../controllers/SupplierController");
const { validateAccessToken, checkWhiteList } = require("../helpers/auth");

const router = express.Router();

router.get("/", validateAccessToken, checkWhiteList, (req, res) =>
  SupplierController.selectAll(req, res)
);
router.post("/", validateAccessToken, checkWhiteList, (req, res) =>
  SupplierController.create(req, res)
);

router.get("/:id", validateAccessToken, checkWhiteList, (req, res) =>
  SupplierController.selectById(req, res)
);
router.put("/:id", validateAccessToken, checkWhiteList, (req, res) =>
  SupplierController.update(req, res)
);

module.exports = router;
