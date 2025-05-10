require("dotenv").config();
const express = require("express");
const fileUpload = require("express-fileupload");
const morgan = require("morgan");
const cors = require("cors");
const bodyParser = require("body-parser");
const redis = require("./helpers/redis.js");

const cookieParser = require("cookie-parser");

const app = express();
const PORT =
  process.env.NODE_ENV === "dev" ? process.env.PORT_DEV : process.env.PORT_PROD;

(async () => {
  // Middleware
  app.use(express.json());
  app.use(morgan("dev"));

  const devMode = process.env.NODE_ENV === "dev" || process.env.DEV;

  let allowedOrigins = ["http://localhost:8888"];

  let corsOptions = {
    origin: (origin, callback) => {
      // Allow all on dev mode
      if (devMode) {
        callback(null, true);
      } else if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true); // Allow access
      } else {
        console.log("Not allowed by CORS");
        callback(new Error("Not allowed by CORS")); // Block access
      }
    },
    methods: ["GET", "POST", "PUT"], // Allowed methods
    credentials: true, // Allow cookies if needed
    allowedHeaders: ["Content-Type", "Authorization"], // Specify allowed headers
  };

  app.set("trust proxy", 1);
  app.use(bodyParser.json({ limit: "50mb" }));
  app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
  app.use(cors(corsOptions));
  app.use(express.json());
  app.use(cookieParser());

  app.use((req, res, next) => {
    res.setHeader(
      "Content-Security-Policy",
      "default-src 'self'; script-src 'self';"
    );
    next();
  });

  await redis.addConn();

  // Routes

  app.use(require("./modules/routes/baseRoutes.js"));

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
})();
