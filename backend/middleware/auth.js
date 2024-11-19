import { digest } from '../utils/cryptography.js';
import { getThisAndLastMinute } from '../utils/chronography.js';

export default ({ method, _parsedUrl: { pathname }, headers: { authorization = '' } }, res, next) => {
  const [type, token] = authorization.split(' ');
  const [thisMinute, lastMinute] = getThisAndLastMinute();
  const thisMinuteHash = digest(thisMinute + method + pathname);
  const lastMinuteHash = digest(lastMinute + method + pathname);
  if (type === 'Bearer' && (token === thisMinuteHash || token === lastMinuteHash)) {
    next();
  } else {
    return res.status(401).json({ error: 'unauthorized: bad token' });
  };
};
