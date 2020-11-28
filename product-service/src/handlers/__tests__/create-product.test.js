import { createProduct } from '../create-product';
import { productsService } from '../../services/products-service';
import { notificationService } from '../../services/notification-service';
import { BaseError } from '../../models/base-error';
import { corsHeaders } from '../../helpers/cors';

jest.mock('../../services/notification-service', () => {
  const notificationServiceInstance = {
    sendProductCreatedNotification: jest.fn(),
  };
  return { notificationService: notificationServiceInstance };
});

jest.mock('../../services/products-service', () => {
  const productsServiceInstance = {
    createProduct: jest.fn(),
  };
  return { productsService: productsServiceInstance };
});

describe('createProduct', () => {
  let eventMock;
  beforeEach(() => {
    eventMock = {
      body: JSON.stringify({
        title: 'testId',
        description: 'test description',
        price: 123,
        count: 3,
      }),
    };
  });
  test('should return response with product returned by the service', async () => {
    const productMock = 'productMock';
    productsService.createProduct.mockResolvedValueOnce(productMock);

    expect(await createProduct(eventMock)).toEqual({
      statusCode: 200,
      headers: { ...corsHeaders },
      body: JSON.stringify({ product: productMock }),
    });
  });

  test('should send notification about new product created', async () => {
    const productMock = {
      id: 'newProductId',
      title: 'testId',
      description: 'test description',
      price: 123,
      count: 3,
    };
    productsService.createProduct.mockResolvedValueOnce(productMock);

    await createProduct(eventMock);
    expect(
      notificationService.sendProductCreatedNotification,
    ).toHaveBeenCalledWith(productMock);
  });

  test('should return response with error, if service throws BaseError', async () => {
    const error = new BaseError(500, 'Some test error');
    productsService.createProduct.mockRejectedValueOnce(error);

    expect(await createProduct(eventMock)).toMatchObject({
      statusCode: error.code,
      body: JSON.stringify({ error: error.message }),
    });
  });

  test('should return 500 response, if service throws not BaseError', async () => {
    const error = new Error('Some test error');
    productsService.createProduct.mockRejectedValueOnce(error);

    const actualResult = await createProduct(eventMock);

    expect(actualResult).toMatchObject({
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    });
  });
});
