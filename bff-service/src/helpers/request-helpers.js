function mapHeaders(requestHeaders, method) {
  const recepientRequestHeaders = { ...requestHeaders };
  delete recepientRequestHeaders['host'];
  if (!hasBody(method)) {
    delete recepientRequestHeaders['content-length'];
  }
  return recepientRequestHeaders;
}

function hasBody(method) {
  return method === 'POST' || method === 'PUT' || method === 'PATCH';
}

module.exports = {
  mapHeaders,
  hasBody,
};
