'use strict';
import { productsService } from '../services/products-service';
import { corsHeaders } from '../helpers/cors';

export async function getProductsList(event) {
  try {
    console.log('getProductsList was called with next event', event);
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
