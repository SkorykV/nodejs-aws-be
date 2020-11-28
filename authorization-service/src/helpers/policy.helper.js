export function generatePolicy(principal, effect, resource) {
  return {
    principalId: principal,
    policyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Effect: effect,
          Action: 'execute-api:Invoke',
          Resource: resource,
        },
      ],
    },
  };
}
