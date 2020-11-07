'use strict';
import { productsService } from '../services/products-service';

export async function getProductsList(event) {
  try {
    const products = await productsService.getAvailableProducts();
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify(products),
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
