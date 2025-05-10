const express = require("express");
const EquipmentController = require("../controllers/EquipmentController");
const EquipmentsDetailController = require("../controllers/EquipmentsDetailController");
const { validateAccessToken, checkWhiteList } = require("../helpers/auth");

const router = express.Router();

router.get("/", validateAccessToken, checkWhiteList, (req, res) =>
  EquipmentController.selectAll(req, res)
);
router.post("/", validateAccessToken, checkWhiteList, (req, res) =>
  EquipmentController.create(req, res)
);

router.get("/:id", validateAccessToken, checkWhiteList, (req, res) =>
  EquipmentController.selectById(req, res)
);
router.get("/details/:id", validateAccessToken, checkWhiteList, (req, res) =>
  EquipmentsDetailController.selectById(req, res)
);
router.put("/:id", validateAccessToken, checkWhiteList, (req, res) =>
  EquipmentController.update(req, res)
);
router.put("/details/:id", validateAccessToken, checkWhiteList, (req, res) =>
  EquipmentsDetailController.updateDetails(req, res)
);

module.exports = router;
