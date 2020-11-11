import { getProductsList } from '../get-products';
import { productsService } from '../../services/products-service';

jest.mock('../../services/products-service', () => {
  const productsServiceInstance = {
    getAvailableProducts: jest.fn(),
  };
  return {
    productsService: productsServiceInstance,
  };
});

describe('getProductsList', () => {
  let eventMock;
  beforeEach(() => {
    eventMock = {
      pathParameters: {
        productId: 'testId',
      },
    };
  });
  test('should return response with products returned by the service', async () => {
    const productsMock = ['productMock'];
    productsService.getAvailableProducts.mockResolvedValueOnce(productsMock);

    expect(await getProductsList(eventMock)).toEqual({
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify(productsMock),
    });
  });
});
