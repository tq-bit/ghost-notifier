import winston from 'winston';

const logger: winston.Logger = winston.createLogger({
  format: winston.format.combine(winston.format.json(), winston.format.timestamp()),
  transports: [
    new winston.transports.File({
      filename: './logs/error.log',
      level: 'error',
    }),
    new winston.transports.File({ filename: './logs/info.log', level: 'info' }),
    new winston.transports.File({ filename: './logs/access.log', level: 'http' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize({ all: true }),
        winston.format.simple(),
        winston.format.timestamp()
      ),
      level: 'verbose',
    })
  );
}

export default logger;
