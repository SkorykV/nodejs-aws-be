import { getProductsList } from '../get-products';
import { ProductsService } from '../../services/products-service';

jest.mock('../../services/products-service', () => {
  const productsServiceInstance = {
    getAvailableProducts: jest.fn()
  };
  return {
    ProductsService: function() {
      return productsServiceInstance
    }
  }
});

describe('getProductsList', () => {
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
  test('should return response with products returned by the service', async () => {
    const productsMock = ['productMock'];
    serviceInstance.getAvailableProducts.mockResolvedValueOnce(productsMock);

    expect(await getProductsList(eventMock)).toEqual({
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify(productsMock),
    })
  })
})