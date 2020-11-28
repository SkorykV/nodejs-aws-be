export function parseBasicToken(token) {
  const buf = Buffer.from(token.replace('Basic ', ''), 'base64');

  return buf.toString('utf-8').split(':');
}
