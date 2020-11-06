'use strict';
import { ProductsService } from '../services/products-service';

export async function getProductsList(event) {
  const productsService = new ProductsService();
  const products = await productsService.getAvailableProducts();
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify(products),
  };
};
