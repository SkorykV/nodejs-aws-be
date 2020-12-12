const redis = require('redis');
const express = require('express');
const axios = require('axios');
const getCacheMiddleWare = require('./middlewares/cache-middleware');
const { mapHeaders, hasBody } = require('./helpers/request-helpers');

const ENVIRONMENT = process.env.NODE_ENV || 'development';

console.log(`Running in ${ENVIRONMENT} environment`);

if (ENVIRONMENT !== 'production') {
  require('dotenv').config();
}

const app = express();

app.use(express.json());

const redisClient = redis.createClient(
  process.env.REDIS_PORT || 6379,
  process.env.REDIS_HOST,
);

redisClient.on('error', function (error) {
  if (error.code === 'ECONNREFUSED') {
    console.error('Can`t connect to the Redis cache', error);
    process.exit(1);
  }
});

app.all('*', getCacheMiddleWare(redisClient), async function (req, res) {
  const [serviceName, ...apiPathParts] = req.path.slice(1).split('/');

  const recepientURL = process.env[serviceName];

  if (!recepientURL) {
    res.status(502).json({ error: 'Cannot process request' });
    return;
  }

  const requestConfig = {
    baseURL: recepientURL,
    url: apiPathParts.join('/'),
    method: req.method,
    headers: mapHeaders(req.headers, req.method),
    params: req.query,
  };

  if (hasBody(req.method)) {
    requestConfig.data = req.body;
  }

  try {
    const response = await axios(requestConfig);

    if (req.method === 'GET') {
      redisClient.setex(
        req.originalUrl,
        60 * 2,
        JSON.stringify({ status: response.status, data: response.data }),
        (err) => {
          if (!err) {
            console.log('I SAVED RESPONSE FOR ', req.originalUrl);
          }
        },
      );
    }

    res.status(response.status).json(response.data);
  } catch (e) {
    res.status(e.response.status).json(e.response.data);
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`server started on port ${PORT}`);
});
