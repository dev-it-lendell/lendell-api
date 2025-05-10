const jwt = require("jsonwebtoken");
const redis = require("./redis.js");
const {
  HTTP_STATUS,
  errorResponse,
  successResponse,
} = require("../helpers/httpStatus");

const extractTokenFromRequest = (req) => {
  return (
    req.headers?.authorization?.split(" ")?.[1] ||
    req.query.accessToken ||
    req.body.accessToken
  );
};

const verifyAccessToken = (token, ignoreExpiration) => {
  if (!token) return null;

  try {
    const user = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, {
      ignoreExpiration: ignoreExpiration ?? false,
    });

    return user;
  } catch (err) {
    if (process.env.DEV) console.log(err);
    return null;
  }
};

const validateAccessToken = (req, res, next) => {
  const token = extractTokenFromRequest(req);
  const user = verifyAccessToken(token, true);
  if (!token || !user) {
    errorResponse(
      res,
      HTTP_STATUS.UNAUTHORIZED,
      "Validation: Access token is invalid or expired.",
      {
        message: "Validation: Access token is invalid or expired.",
        tokenError: true,
      }
    );
    return;
  }

  req.user = user;
  req.accessToken = token;
  next();
};

const validatePwResetToken = (req, res, next) => {
  const token = extractTokenFromRequest(req);
  const user = verifyAccessToken(token, false);

  if (!token || !user) {
    errorResponse(
      res,
      HTTP_STATUS.UNAUTHORIZED,
      "Access token is invalid or expired.",
      { message: "Access token is invalid or expired.", tokenError: true }
    );
    return;
  }

  req.user = user;
  req.accessToken = token;
  next();
};

const checkWhiteList = async (req, res, next) => {
  const appCode = req.user.appCode ?? "";
  const userCode = `${appCode}${req.user.code ?? req.user.username}`;
  const userFromThirdPartyApp = userCode
    .toUpperCase()
    .startsWith(`${appCode}CLIENT_`);

  // Do not check the whitelist if user is from a third party app (ie HIMS, NURSE STATION, etc.)
  if (userFromThirdPartyApp) {
    next();
    return;
  }

  const redisConn = redis.getConn();
  try {
    const whiteListedToken = await redisConn.get(userCode);

    if (whiteListedToken !== req.accessToken) {
      errorResponse(
        res,
        HTTP_STATUS.UNAUTHORIZED,
        "White List: Access token is not whitelisted.",
        {
          message: "White List: Access token is not whitelisted.",
          tokenError: true,
        }
      );
      return;
    }

    next();
  } catch (err) {
    console.log(err);
    errorResponse(
      res,
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      "Unable to check if token is whitelisted.",
      err
    );
  }
};

const respond = (expressJsResponse, val) => {
  if (val == null) {
    expressJsResponse.json(null);
    return;
  }

  // FOR BACKWARD COMPATIBILITY
  if (val.error) {
    expressJsResponse.status(500).json(val.error);
    return;
  }

  if (val instanceof Error) {
    expressJsResponse.status(500).json("Server Error");
    return;
  }

  if (val.status || val.body) {
    expressJsResponse.status(val.status ?? 200).json(val.body ?? null);
    return;
  }

  expressJsResponse.json(val);
};

const sanitizeRequestPayload = (allowedProps, payload) => {
  return allowedProps.reduce((acc, e) => {
    if (payload[e] == null || payload[e] === "") {
      return acc;
    }

    acc[e] = payload[e];
    return acc;
  }, {});
};

module.exports = {
  extractTokenFromRequest,
  verifyAccessToken,
  validateAccessToken,
  validatePwResetToken,
  checkWhiteList,
  respond,
  sanitizeRequestPayload,
};
