import { IncomingHttpHeaders } from 'http';

export function mapHeaders(
  requestHeaders: IncomingHttpHeaders,
  method: string,
) {
  const recepientRequestHeaders = { ...requestHeaders };
  delete recepientRequestHeaders['host'];
  if (!hasBody(method)) {
    delete recepientRequestHeaders['content-length'];
  }
  return recepientRequestHeaders;
}

export function hasBody(method) {
  return method === 'POST' || method === 'PUT' || method === 'PATCH';
}
