import { ProductsService } from '../products-service';
import { BaseError } from '../../models/base-error';

jest.mock('../../data/products-list.json', () => {
  return [{id: 'testId1'}, {id: 'testId2'}]
})

describe('ProductsService', () => {
  let serviceInstance;
  beforeEach(() => {
    serviceInstance = new ProductsService();
  })
  test('getAvailableProducts should return all products', async () => {
    expect(await serviceInstance.getAvailableProducts()).toEqual([{id: 'testId1'}, {id: 'testId2'}])
  })
  test('getProductById should return product with specified id if it is present', async () => {
    expect(await serviceInstance.getProductById('testId2')).toEqual({id: 'testId2'});
  })
  test('getProductById should throw BaseError if product does not exist', async () => {
    expect.assertions(1);
    try {
      await serviceInstance.getProductById('testId3');
    }
    catch(e) {
      expect(e).toBeInstanceOf(BaseError)
    }
  })
})