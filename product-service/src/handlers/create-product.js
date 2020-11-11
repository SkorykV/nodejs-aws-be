'use strict';
import { productsService } from '../services/products-service';
import { BaseError } from '../models/base-error';
import { corsHeaders } from '../helpers/cors';

export async function createProduct(event) {
  try {
    const productData = JSON.parse(event.body);
    console.log('createProduct was called with next data:', productData);
    const product = await productsService.createProduct(productData);
    return {
      statusCode: 200,
      headers: { ...corsHeaders },
      body: JSON.stringify({ product }),
    };
  } catch (e) {
    if (e instanceof BaseError) {
      return {
        statusCode: e.code,
        headers: {
          ...corsHeaders,
        },
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
