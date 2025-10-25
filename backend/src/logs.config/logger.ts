import winston from "winston";
import "winston-daily-rotate-file";

// Common log format
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.printf(
    (info) => `[${info.timestamp}] ${info.level.toUpperCase()}: ${info.message}`,
  ),
);

// Daily rotating file transport
const transport = new winston.transports.DailyRotateFile({
  dirname: "logs", // logs folder
  filename: "app-%DATE%.log", // log name per day
  datePattern: "YYYY-MM-DD",
  zippedArchive: true, // compress old logs
  maxSize: "20m",
  maxFiles: "7d", // keep 7 days of logs
});

const logger = winston.createLogger({
  level: "info",
  format: logFormat,
  transports: [
    transport,
    new winston.transports.Console({
      format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
    }),
  ],
});

export default logger;
