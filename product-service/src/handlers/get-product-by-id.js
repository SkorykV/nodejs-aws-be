'use strict';
import { ProductsService } from '../services/products-service';
import { BaseError } from '../models/base-error';

export async function getProductById(event) {
  const productsService = new ProductsService();
  const productId = event.pathParameters.productId;
  try {
    const product = await productsService.getProductById(productId);
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ product }),
    };
  } catch (e) {
    if (e instanceof BaseError) {
      return {
        statusCode: e.code,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ error: e.message }),
      };
    }
    throw e;
  }
}
