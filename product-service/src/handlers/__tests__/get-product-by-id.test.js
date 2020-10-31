import { getProductById } from '../get-product-by-id';
import { ProductsService } from '../../services/products-service';
import { BaseError } from '../../models/base-error';

jest.mock('../../services/products-service', () => {
  const productsServiceInstance = {
    getProductById: jest.fn()
  };
  return {
    ProductsService: function() {
      return productsServiceInstance
    }
  }
});

describe('getProductById', () => {
  let eventMock;
  let serviceInstance;
  beforeEach(() => {
    eventMock = {
      pathParameters: {
        productId: 'testId'
      }
    }
    serviceInstance = new ProductsService();
  })
  test('should return response with product returned by the service', async () => {
    const productMock = 'productMock';
    serviceInstance.getProductById.mockResolvedValueOnce(productMock);

    expect(await getProductById(eventMock)).toEqual({
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ product: productMock }),
    })
  })
  test('should return response with error, if service throws BaseError', async () => {
    const error = new BaseError(500, 'Some test error');
    serviceInstance.getProductById.mockRejectedValueOnce(error);

    expect(await getProductById(eventMock)).toMatchObject({
      statusCode: error.code,
      body: JSON.stringify({ error: error.message })
    })
  })

  test('should throwerror, if service throws not BaseError', async () => {
    expect.assertions(1);
    const error = new Error('Some test error');
    serviceInstance.getProductById.mockRejectedValueOnce(error);

    try {
      await getProductById(eventMock);
    }
    catch(e) {
      expect(e).toBe(error);
    }
  })
})