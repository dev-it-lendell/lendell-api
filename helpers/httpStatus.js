// httpStatus.js
const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
};

const errorResponse = (res, statusCode, message, error = null) => {
  return res.status(statusCode).json({
    status: "error",
    message,
    error,
  });
};

const successResponse = (res, statusCode, message, data = null) => {
  return res.status(statusCode).json({
    status: "success",
    message,
    data,
  });
};

module.exports = {
  HTTP_STATUS,
  errorResponse,
  successResponse,
};
