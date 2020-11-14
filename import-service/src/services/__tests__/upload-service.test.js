import * as awsMock from 'aws-sdk-mock';
import AWS from 'aws-sdk';
import { uploadService } from '../upload-service';

describe('uploadService', () => {
  beforeAll(() => {
    awsMock.setSDKInstance(AWS);
  });
  test('should return signed url', async () => {
    expect.assertions(3);
    const signedUrlMock = 'signedUrlMock';
    awsMock.mock('S3', 'getSignedUrl', (operation, params, callback) => {
      expect(operation).toBe('putObject');
      expect(params).toMatchObject({
        Bucket: 'bucket',
        Key: 'key',
        ContentType: 'contentType',
      });
      return callback(null, signedUrlMock);
    });
    expect(
      await uploadService.getSignedUrl('bucket', 'key', 'contentType'),
    ).toBe(signedUrlMock);
  });

  test('should throw correct error, if s3 operation failed', async () => {
    expect.assertions(1);
    const error = new Error('Getting Signed Url Failed');
    awsMock.remock('S3', 'getSignedUrl', (operation, params, callback) => {
      return callback(error);
    });
    try {
      await uploadService.getSignedUrl('bucket', 'key', 'contentType');
    } catch (e) {
      expect(e).toEqual(new Error(error.message));
    }
  });

  afterAll(() => {
    awsMock.restore();
  });
});
