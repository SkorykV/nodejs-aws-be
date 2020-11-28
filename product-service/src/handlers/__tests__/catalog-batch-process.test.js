import { catalogBatchProcess } from '../catalog-batch-process';
import { notificationService } from '../../services/notification-service';
import { productsService } from '../../services/products-service';

jest.mock('../../services/notification-service', () => {
  const notificationServiceInstance = {
    sendProductCreatedNotification: jest.fn(),
  };
  return { notificationService: notificationServiceInstance };
});

jest.mock('../../services/products-service', () => {
  const productsServiceInstance = {
    createProductsBatch: jest.fn(async (products) => [products[1]]),
  };
  return { productsService: productsServiceInstance };
});

describe('catalogBatchProcess', () => {
  let eventMock;
  beforeEach(() => {
    eventMock = {
      Records: [
        {
          body: JSON.stringify({
            title: 'test1',
            description: 'test description1',
            price: 123,
            count: 3,
          }),
        },
        {
          body: JSON.stringify({
            title: 'test2',
            description: 'test description2',
            price: 123,
            count: 3,
          }),
        },
      ],
    };
  });
  test('should pass products data to createProductsBatch', async () => {
    await catalogBatchProcess(eventMock);
    expect(productsService.createProductsBatch).toHaveBeenCalledWith(
      eventMock.Records.map((record) => JSON.parse(record.body)),
    );
  });
  test('should send notifications only about newly created products', async () => {
    await catalogBatchProcess(eventMock);
    expect(
      notificationService.sendProductCreatedNotification,
    ).not.toHaveBeenCalledWith(JSON.parse(eventMock.Records[0].body));
    expect(
      notificationService.sendProductCreatedNotification,
    ).toHaveBeenCalledWith(JSON.parse(eventMock.Records[1].body));
  });
  test('should throw an error if createProductsBatch fails', async () => {
    const error = new Error('Some DB issue');
    productsService.createProductsBatch.mockRejectedValueOnce(error);
    expect.assertions(1);
    try {
      await catalogBatchProcess(eventMock);
    } catch (e) {
      expect(e).toBe(error);
    }
  });
});
