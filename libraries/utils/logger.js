const winston = require('winston');
const config = require('config');
const { name, version } = require('../../package.json');
require('winston-logstash');


let logger;

if (process.env.NODE_ENV === 'test') {
  // for testing only print error to console
  logger = new winston.Logger({
    transports: [
      new winston.transports.Console({ level: 'error' }),
    ],
  });
} else if (process.env.NODE_ENV === 'development') {
  // for development no need to send to logstash
  logger = new winston.Logger({
    exitOnError: false,
    transports: [
      new winston.transports.File({
        filename: 'combined.log',
        level: 'info',
      }),
      new winston.transports.Console({
        level: 'warn',
      }),
    ],
  });
} else if (process.env.NODE_ENV === 'production') {
  // for production send error to logstash
  logger = new winston.Logger({
    exitOnError: false,
    transports: [
      new winston.transports.File({
        filename: 'combined.log',
        level: 'info',
      }),
      new winston.transports.Console({
        level: 'warn',
      }),
      new winston.transports.Logstash({
        level: 'warn',
        port: config.get('logstash.port'),
        host: config.get('logstash.host'),
        max_connect_retries: -1,
      }).on('error', (e) => {
        console.log(e);
      }),

    ],
  });
}

const logError = (err, httpCode, expressReq) => {
  logger.error(err.message, {
    http_code: httpCode,
    stack: err.stack,
    name: err.name,
    service: name,
    version,
    route: `${expressReq.protocol}://${expressReq.get('host')}${expressReq.originalUrl}`,
    ip: expressReq.ip,
    user_agent: expressReq.get('User-Agent'),
  });
};

const logWarn = (context) => {

};

const logInfo = (context) => {

};
module.exports = {
  logger,
  logError,
  logWarn,
  logInfo,
};
