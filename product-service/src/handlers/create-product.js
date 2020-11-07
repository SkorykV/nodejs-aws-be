'use strict';
import { productsService } from '../services/products-service';
import { BaseError } from '../models/base-error';

export async function createProduct(event) {
  try {
    const product = await productsService.createProduct(JSON.parse(event.body));
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
