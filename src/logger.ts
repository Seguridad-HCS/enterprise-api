import winston from 'winston';
import fileRotation from 'winston-daily-rotate-file';
const logLevels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4
};
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.errors({ stack: true }),
  winston.format.printf((info) => {
    const prefix = `[${info.level}] ${info.timestamp}`;
    return info.stack
      ? `${prefix} - ${info.message} ${info.stack}`
      : `${prefix} - ${info.message}`;
  })
);
const logTransports = [
  new winston.transports.Console(),
  new fileRotation({
    filename: '../logs/error-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    level: 'error'
  }),
  new fileRotation({
    filename: '../logs/trace-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    level: 'info'
  }),
  new fileRotation({
    filename: '../logs/%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    level: 'http'
  })
];
const errorStackFormat = winston.format((info) => {
  if (info instanceof Error) {
    return Object.assign({}, info, {
      stack: info.stack,
      message: info.message
    });
  }
  return info;
});
const logger = winston.createLogger({
  level: 'debug',
  levels: logLevels,
  format: winston.format.combine(errorStackFormat(), logFormat),
  transports: logTransports
});

export default logger;
