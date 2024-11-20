import logger from "../utils/logger.js";

export default ({ method, url, params, query, body }, res, next) => {
  logger.info(`Request: ${method} - ${url}\n${JSON.stringify({ params, query, body }, null, 2)}`);
  next();
};
