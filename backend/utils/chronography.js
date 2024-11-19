export const getThisAndLastMinute = () => {
  const thisMinute = new Date().toISOString().slice(0, 16);
  const lastMinute = new Date(new Date() - 60000).toISOString().slice(0, 16);
  return [thisMinute, lastMinute];
};
