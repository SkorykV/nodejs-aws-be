import { importProductsFile } from '../import-products-file';
import { uploadService } from '../../services/upload-service';

jest.mock('../../services/upload-service', () => ({
  uploadService: {
    getSignedUrl: jest.fn(),
  },
}));

describe('importProductsFile', () => {
  test('should return 400 status, if no file name provided', async () => {
    expect(
      await importProductsFile({ queryStringParameters: {} }),
    ).toMatchObject({
      statusCode: 400,
    });
  });

  test('should return 500 status code and error message if service throws', async () => {
    const error = new Error('error mock');
    uploadService.getSignedUrl.mockRejectedValueOnce(error);

    expect(
      await importProductsFile({
        queryStringParameters: { name: 'file name' },
      }),
    ).toMatchObject({
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    });
  });

  describe('Positive scenario', () => {
    let actualResult;
    let bucket;
    beforeEach(async () => {
      bucket = process.env.BUCKET;
      const fileName = encodeURIComponent('test file.csv');
      const eventMock = {
        queryStringParameters: { name: fileName },
      };

      uploadService.getSignedUrl.mockResolvedValueOnce('signed url mock');

      actualResult = await importProductsFile(eventMock);
    });

    test('should call service with correct params', () => {
      expect(uploadService.getSignedUrl).toBeCalledWith(
        bucket,
        'uploaded/test file.csv',
        'text/csv',
      );
    });

    test('should return correct status code and signedUrl', () => {
      expect(actualResult).toMatchObject({
        statusCode: 200,
        body: JSON.stringify('signed url mock', null, 2),
      });
    });
  });
});
