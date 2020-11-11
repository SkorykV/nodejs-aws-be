import { getProductById } from '../get-product-by-id';
import { productsService } from '../../services/products-service';
import { BaseError } from '../../models/base-error';
import { corsHeaders } from '../../helpers/cors';

jest.mock('../../services/products-service', () => {
  const productsServiceInstance = {
    getProductById: jest.fn(),
  };
  return { productsService: productsServiceInstance };
});

describe('getProductById', () => {
  let eventMock;
  beforeEach(() => {
    eventMock = {
      pathParameters: {
        productId: 'testId',
      },
    };
  });
  test('should return response with product returned by the service', async () => {
    const productMock = 'productMock';
    productsService.getProductById.mockResolvedValueOnce(productMock);

    expect(await getProductById(eventMock)).toEqual({
      statusCode: 200,
      headers: { ...corsHeaders },
      body: JSON.stringify({ product: productMock }),
    });
  });
  test('should return response with error, if service throws BaseError', async () => {
    const error = new BaseError(500, 'Some test error');
    productsService.getProductById.mockRejectedValueOnce(error);

    expect(await getProductById(eventMock)).toMatchObject({
      statusCode: error.code,
      body: JSON.stringify({ error: error.message }),
    });
  });

  test('should return 500 response, if service throws not BaseError', async () => {
    const error = new Error('Some test error');
    productsService.getProductById.mockRejectedValueOnce(error);

    const actualResult = await getProductById(eventMock);

    expect(actualResult).toMatchObject({
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    });
  });
});
