require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cacheService = require('./services/cache-service').cacheService;

const app = express();

app.use(express.json());

app.all('*', async function (req, res) {
  const [serviceName, ...apiPathParts] = req.path.slice(1).split('/');

  const recepientURL = process.env[serviceName];

  if (!recepientURL) {
    res.status(502).json({ error: 'Cannot process request' });
    return;
  }

  const urlConfig = {
    baseURL: recepientURL,
    url: apiPathParts.join('/'),
  };

  const cacheKey = JSON.stringify(urlConfig);

  if (req.method === 'GET' && cacheService.checkInCache(cacheKey)) {
    const cachedResponse = cacheService.getFromCache(cacheKey);
    res.status(cachedResponse.status).json(cachedResponse.data);
    return;
  }

  const requestConfig = {
    ...urlConfig,
    method: req.method,
    headers: mapHeaders(req.headers, req.method),
  };

  if (couldHaveBody(req.method)) {
    requestConfig.data = req.body;
  }

  //console.log(JSON.stringify(requestConfig, null, 4));

  try {
    const response = await axios(requestConfig);

    if (req.method === 'GET') {
      cacheService.cacheForNms(
        cacheKey,
        { status: response.status, data: response.data },
        20000,
      );
    }

    res.status(response.status).json(response.data);
  } catch (e) {
    //console.log(e);
    res.status(e.response.status).json(e.response.data);
  }
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log('server started');
});

function mapHeaders(requestHeaders, method) {
  const recepientRequestHeaders = { ...requestHeaders };
  delete recepientRequestHeaders['host'];
  if (!couldHaveBody(method)) {
    delete recepientRequestHeaders['content-length'];
  }
  return recepientRequestHeaders;
}

function couldHaveBody(method) {
  return method === 'POST' || method === 'PUT' || method === 'PATCH';
}
