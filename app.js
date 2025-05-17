require("dotenv").config();
const express = require("express");
const fileUpload = require("express-fileupload");
const morgan = require("morgan");
const cors = require("cors");
const bodyParser = require("body-parser");
const utils = require("./helpers/utils.js");
// const redis = require("./helpers/redis.js");

const cookieParser = require("cookie-parser");

utils.logMessage("App starting...");

const app = express();
const PORT =
  process.env.NODE_ENV === "dev" ? process.env.PORT_DEV : process.env.PORT_PROD;

(async () => {
  const devMode = process.env.NODE_ENV === "dev" || process.env.DEV;

  let allowedOrigins = ["http://localhost:9000"];

  let corsOptions = {
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true); // Allow access
      } else if (devMode) {
        callback(null, true); // Allow access in development mode
      } else {
        console.log("Not allowed by CORS:", origin);
        log("Not allowed by CORS:", origin);
        callback(new Error("Not allowed by CORS")); // Block access
      }
    },
    methods: ["GET", "POST", "PUT", "OPTIONS"],
    credentials: true,
    // allowedHeaders: ["Content-Type", "Authorization"], // Uncomment if needed
  };

  // Middleware
  app.use(express.json());
  app.use(morgan("dev"));

  app.set("trust proxy", 1);
  app.use(bodyParser.json({ limit: "50mb" }));
  app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
  app.use(express.json());
  app.use(cookieParser());
  app.use(cors(corsOptions));

  app.use((req, res, next) => {
    res.setHeader(
      "Content-Security-Policy",
      "default-src 'self'; script-src 'self';"
    );
    next();
  });

  // await redis.addConn();

  // Routes

  app.use(require("./modules/baseModuleRoutes.js"));

  app.listen(PORT, () => {
    utils.logMessage(`Server running on http://localhost:${PORT}`);
    console.log(`Server running on http://localhost:${PORT}`);
  });
})();
