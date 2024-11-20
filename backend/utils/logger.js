import log4js from 'log4js';
import dotenv from 'dotenv';
dotenv.config();

log4js.configure({
  appenders: {
    console: { type: 'console' },
    file: {
      type: 'file',
      filename: 'logs/server.log',
      maxLogSize: 2621440,
      backups: 3,
      compress: true,
    },
  },
  categories: {
    default: { appenders: ['console', 'file'], level: process.env.LOG_LEVEL || 'debug' },
  },
});

const logger = log4js.getLogger('server');

export default logger;
