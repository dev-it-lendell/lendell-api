const router = require("express").Router();

router.get("/", (req, res) => {
  res.json({ message: "Welcome to Lendell API - LOMIS" });
});

router.use("/inquiry", require("./inquiryRoutes"));

module.exports = router;
