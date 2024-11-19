export default ({ _parsedUrl: { pathname } }, res, next) => {
  res.status(404).json({ error: `path ${pathname} not found` });
  return;
};
