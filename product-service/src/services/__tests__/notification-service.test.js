import * as awsMock from 'aws-sdk-mock';
import AWS from 'aws-sdk';
import { notificationService } from '../notification-service';

describe('notificationService', () => {
  let productMock;
  beforeAll(() => {
    awsMock.setSDKInstance(AWS);
  });
  beforeEach(() => {
    productMock = {
      id: 'test',
      title: 'test1',
      description: 'test description1',
      price: 123,
      count: 3,
    };
  });
  test('should return signed url', async () => {
    expect.assertions(6);

    awsMock.mock('SNS', 'publish', (params, callback) => {
      expect(params.Message).toMatch(productMock.id);
      expect(params.Message).toMatch(productMock.title);
      expect(params.Message).toMatch(productMock.description);
      expect(params.Message).toMatch(String(productMock.price));
      expect(params.Message).toMatch(String(productMock.count));
      expect(params).toMatchObject({
        TopicArn: 'topic_arn',
        Subject: 'New products created',
        MessageAttributes: {
          price: {
            DataType: 'Number',
            StringValue: String(productMock.price),
          },
        },
      });
      return callback(null, 'success');
    });

    await notificationService.sendProductCreatedNotification(productMock);
  });

  afterAll(() => {
    awsMock.restore();
  });
});
