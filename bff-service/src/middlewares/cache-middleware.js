const { promisify } = require('util');
module.exports = function getCacheMiddleWare(client) {
  const redisGetPromise = promisify(client.get).bind(client);
  return async function (req, res, next) {
    if (req.method === 'GET') {
      const cachedResponse = await redisGetPromise(req.originalUrl);
      if (cachedResponse) {
        console.log('I RETURN RESPONSE FROM CACHE FOR', req.originalUrl);
        const parsedResponse = JSON.parse(cachedResponse);
        res.status(parsedResponse.status).json(parsedResponse.data);
        return;
      }
    }
    next();
  };
};
