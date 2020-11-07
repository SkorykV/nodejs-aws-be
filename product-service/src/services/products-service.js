'use strict';
import { BaseError } from '../models/base-error';
import { productPostgresRepository } from '../db/postgres/product.postgres.repository';

export class ProductsService {
  async getAvailableProducts() {
    try {
      return await productPostgresRepository.getAllProducts();
    } catch (e) {
      throw new BaseError(500, e.message);
    }
  }

  async getProductById(id) {
    try {
      const foundProduct = await productPostgresRepository.getProductByID(id);
      if (!foundProduct) {
        throw new BaseError(404, `Product with ${id} was not found`);
      }
      return foundProduct;
    } catch (e) {
      throw new BaseError(500, e.message);
    }
  }
}
