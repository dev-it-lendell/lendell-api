const router = require("express").Router();

router.get("/", (req, res) => {
  res.json({ message: "Welcome to Lendell API - LOSIS" });
});

router.use("/talkpush", require("./talkpushRoutes"));
router.use("/candidates", require("./candidatesRoutes"));
router.use("/clients", require("./clientsRoutes"));

module.exports = router;
