'use strict';
import { BaseError } from '../models/base-error';
import { productPostgresRepository } from '../db/postgres/product.postgres.repository';

class ProductsService {
  async getAvailableProducts() {
    return await productPostgresRepository.getAllProducts();
  }

  async getProductById(id) {
    const foundProduct = await productPostgresRepository.getProductById(id);
    if (!foundProduct) {
      throw new BaseError(404, `Product with ${id} was not found`);
    }
    return foundProduct;
  }

  async createProduct(productData) {
    return await productPostgresRepository.createProduct(productData);
  }

  async createProductsBatch(productsData) {
    return await productPostgresRepository.insertProductsBatch(productsData);
  }
}

export const productsService = new ProductsService();
