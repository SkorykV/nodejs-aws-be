import { authService } from '../services/auth.service';
import { parseBasicToken } from '../helpers/basic-token.helper';
import { generatePolicy } from '../helpers/policy.helper';
import { PolicyEffect } from '../types/policy.types';

export function basicAuthorizer(event, context, callback) {
  if (event.type !== 'TOKEN') {
    return callback('Unauthorized');
  }

  try {
    const [username, password] = parseBasicToken(event.authorizationToken);

    const isAuthorized = authService.authorize(username, password);

    if (!isAuthorized) {
      return callback(
        null,
        generatePolicy(username, PolicyEffect.deny, event.methodArn),
      );
    }

    callback(
      null,
      generatePolicy(username, PolicyEffect.allow, event.methodArn),
    );
  } catch (e) {
    console.log('Authorizer error', e);
    callback(e);
  }
}
