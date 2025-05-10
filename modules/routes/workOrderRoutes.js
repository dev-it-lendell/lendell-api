const express = require("express");
const WorkOrderController = require("../controllers/WorkOrderController");
const WorkOrdersDetailController = require("../controllers/WorkOrdersDetailController");
const { validateAccessToken, checkWhiteList } = require("../helpers/auth");

const router = express.Router();

router.get("/", validateAccessToken, checkWhiteList, (req, res) =>
  WorkOrderController.selectAll(req, res)
);

router.get("/equipment", (req, res) =>
  WorkOrderController.selectByEquipment(req, res)
);

router.post("/", validateAccessToken, checkWhiteList, (req, res) =>
  WorkOrderController.create(req, res)
);
router.post("/repair", validateAccessToken, checkWhiteList, (req, res) =>
  WorkOrderController.repair(req, res)
);

router.get("/:id", validateAccessToken, checkWhiteList, (req, res) =>
  WorkOrderController.selectById(req, res)
);

router.put("/:id", validateAccessToken, checkWhiteList, (req, res) =>
  WorkOrderController.update(req, res)
);
router.get(
  "/details/:workOrderCode/:equipmentCode",
  validateAccessToken,
  checkWhiteList,
  (req, res) => WorkOrdersDetailController.selectWorkOrderDetails(req, res)
);

module.exports = router;
