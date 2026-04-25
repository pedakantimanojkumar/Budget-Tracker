import winston from "winston";

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(
      ({ timestamp, level, message }) =>
        `${timestamp} [${level.toUpperCase()}]: ${message}`
    )
  ),
  transports: [
    new winston.transports.Console(),

    // Log errors to file
    new winston.transports.File({ filename: "logs/error.log", level: "error" }),

    // Log everything
    new winston.transports.File({ filename: "logs/combined.log" }),
  ],
});

export default logger;