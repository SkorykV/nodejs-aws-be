'use strict';
import availableProducts from '../data/products-list.json';
import { BaseError } from '../models/base-error';

export class ProductsService {
  async getAvailableProducts() {
    return availableProducts;
  }

  async getProductById(id) {
    const foundProduct = availableProducts.find((p) => p.id === id);
    if (!foundProduct) {
      throw new BaseError(404, `Product with ${id} was not found`);
    }
    return foundProduct;
  }
}
