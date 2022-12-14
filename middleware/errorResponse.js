const { ErrorService } = require("../utils/errorFormat.js");
const { writeLog_throw } = require("../utils/logService.js");

module.exports = (err, req, res, next) => {
  let resHTTPCode = 500;

  if (err.httpStatusCode) {
    resHTTPCode = err.httpStatusCode;
  }
  if (err.status) {
    resHTTPCode = err.status;
  }
  if (err.name === "TokenExpiredError" || err.name === "JsonWebTokenError") {
    resHTTPCode = 401; // ดัก Error จากการ Auth Token
  }
  if (
    err.name === "SequelizeValidationError" ||
    err.name === "SequelizeUniqueConstraintError"
  ) {
    resHTTPCode = 400;
    err.message = (err.errors[0] && err.errors[0].message) || err.message;
  }

  const resError = ErrorService(err);

  writeLog_throw(err, resHTTPCode);

  return res.status(resHTTPCode).json(resError);
};
