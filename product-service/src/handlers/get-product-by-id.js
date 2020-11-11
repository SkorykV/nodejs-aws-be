'use strict';
import { productsService } from '../services/products-service';
import { BaseError } from '../models/base-error';
import { corsHeaders } from '../helpers/cors';
import validate from 'uuid-validate';

export async function getProductById(event) {
  const productId = event.pathParameters.productId;
  console.log(`getProductById was called with ${productId} parameter`);

  try {
    if (!validate(productId)) {
      throw new BaseError(400, 'product id should be uuid');
    }
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
        headers: { ...corsHeaders },
        body: JSON.stringify({ error: e.message }),
      };
    }
    return {
      statusCode: 500,
      headers: { ...corsHeaders },
      body: JSON.stringify({ error: e.message }),
    };
  }
}
