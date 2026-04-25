import logger from "../utils/logger.js";

const errorMiddleware = (err, req, res, next) => {
  logger.error(err.stack);

  res.status(err.status || 500).json({
    message: err.message || "Server Error",
  });
};

export default errorMiddleware;