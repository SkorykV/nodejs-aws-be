import { productsService } from '../products-service';
import { BaseError } from '../../models/base-error';

jest.mock('../../db/postgres/product.postgres.repository', () => {
  const products = [{ id: 'testId1' }, { id: 'testId2' }];
  return {
    productPostgresRepository: {
      getAllProducts: jest.fn().mockResolvedValue(products),
      getProductById: jest.fn(async (id) => {
        const product = products.find((p) => p.id === id);
        return product;
      }),
      createProduct: jest.fn().mockResolvedValue('createdProductMock'),
      createProductsBatch: jest
        .fn()
        .mockResolvedValue('createdProductsBatchMock'),
    },
  };
});

describe('ProductsService', () => {
  test('getAvailableProducts should return all products', async () => {
    expect(await productsService.getAvailableProducts()).toEqual([
      { id: 'testId1' },
      { id: 'testId2' },
    ]);
  });
  test('getProductById should return product with specified id if it is present', async () => {
    expect(await productsService.getProductById('testId2')).toEqual({
      id: 'testId2',
    });
  });
  test('getProductById should throw BaseError if product does not exist', async () => {
    expect.assertions(1);
    try {
      await productsService.getProductById('testId3');
    } catch (e) {
      expect(e).toBeInstanceOf(BaseError);
    }
  });
  test('createProduct should retun product that was created', async () => {
    expect(await productsService.createProduct('mockedData')).toBe(
      'createdProductMock',
    );
  });
  test('createProductsBatch should return products that were created', async () => {
    expect(await productsService.createProductsBatch('mockedData')).toBe(
      'createdProductsBatchMock',
    );
  });
});
