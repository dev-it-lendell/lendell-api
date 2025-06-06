require("dotenv").config();
const router = require("express").Router();
const jwt = require("jsonwebtoken");

router.get(`/${process.env.BASE_URL}`, (req, res) => {
  res.json({ message: "Welcome to Lendell API V1" });
});

// router.use("/auth", require("./main/routes/authRoutes"));
router.use(
  `/${process.env.BASE_URL}/losis`,
  require("./losis/routes/baseRoutes")
);
router.use(
  `/${process.env.BASE_URL}/lomis`,
  require("./lomis/routes/baseRoutes")
);

// const users = [{ id: 1, username: "admin", password: "admin123" }];

// function generateTokens(user) {
//   const accessToken = jwt.sign(
//     { id: user.id },
//     process.env.ACCESS_TOKEN_SECRET,
//     { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN }
//   );
//   const refreshToken = jwt.sign(
//     { id: user.id },
//     process.env.REFRESH_TOKEN_SECRET,
//     { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN }
//   );
//   return { accessToken, refreshToken };
// }

// // Login route
// router.post("/login", (req, res) => {
//   const { username, password } = req.body;
//   const user = users.find(
//     (u) => u.username === username && u.password === password
//   );
//   if (!user) return res.status(401).send("Invalid credentials");

//   const { accessToken, refreshToken } = generateTokens(user);

//   res.cookie("refreshToken", refreshToken, {
//     httpOnly: true,
//     secure: true,
//     sameSite: "Strict",
//     maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
//   });

//   res.json({ accessToken });
// });

// // Refresh token
// router.post("/refresh", (req, res) => {
//   const { refreshToken } = req.cookies;
//   console.log(req.cookies);
//   if (!refreshToken) return res.sendStatus(401);

//   jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
//     if (err) return res.sendStatus(403);
//     const accessToken = jwt.sign(
//       { id: user.id },
//       process.env.ACCESS_TOKEN_SECRET,
//       { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN }
//     );
//     res.json({ accessToken });
//   });
// });

// // Protected route
// router.get("/profile", (req, res) => {
//   const authHeader = req.headers.authorization;
//   const token = authHeader && authHeader.split(" ")[1];
//   if (!token) return res.sendStatus(401);

//   jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
//     if (err) return res.sendStatus(403);
//     res.json({ id: user.id, message: "Secure content" });
//   });
// });

module.exports = router;
