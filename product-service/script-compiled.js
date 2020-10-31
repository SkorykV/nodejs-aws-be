'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getProductsList = getProductsList;

require("source-map-support/register");

var _productsService = require("../services/products-service");

async function getProductsList(event) {
  const productsService = new _productsService.ProductsService();
  const products = productsService.getAvailableProducts();
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify(products)
  };
}

;
