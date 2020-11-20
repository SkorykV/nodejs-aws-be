import { Client } from 'pg';
import format from 'pg-format';

const { PGUSER, PGPORT, PGHOST, PGPASSWORD, PGDATABASE } = process.env;
const dbOptions = {
  host: PGHOST,
  port: PGPORT,
  user: PGUSER,
  password: PGPASSWORD,
  database: PGDATABASE,
  connectionTimeoutMillis: 5000,
};

class ProductPostgresRepository {
  async getAllProducts() {
    const client = await this._connect();
    try {
      const result = await client.query(
        'select id, title, description, price, "count" from products inner join stocks on products.id = stocks.product_id',
      );
      return result.rows;
    } catch (err) {
      console.log('Error occurred during db request execution', err);
      throw new Error('DB request execution error');
    } finally {
      await client.end();
    }
  }

  async getProductById(id) {
    const client = await this._connect();
    try {
      const result = await client.query(
        'select id, title, description, price, "count" from products inner join stocks on products.id = stocks.product_id where products.id = $1',
        [id],
      );
      return result.rows[0];
    } catch (err) {
      console.log('Error occurred during db request execution', err);
      throw new Error('DB request execution error');
    } finally {
      await client.end();
    }
  }

  async createProduct(productData) {
    const client = await this._connect();
    try {
      await client.query('BEGIN');
      const product = (
        await client.query(
          'insert into products (title, description, price) values ($1, $2, $3) RETURNING *',
          [productData.title, productData.description, productData.price],
        )
      ).rows[0];

      console.log('product successfully created');

      const stock = (
        await client.query(
          'insert into stocks (product_id, "count") values ($1, $2) RETURNING "count"',
          [product.id, productData.count],
        )
      ).rows[0];

      console.log('product successfully created');

      await client.query('COMMIT');
      return { ...product, ...stock };
    } catch (err) {
      console.log('Error occurred during db request execution', err);
      await client.query('ROLLBACK');
      throw new Error('DB request execution error');
    } finally {
      await client.end();
    }
  }

  async insertProductsBatch(data) {
    const client = await this._connect();
    try {
      await client.query('BEGIN');

      const productsData = data.map((product) => [
        product.title,
        product.description,
        product.price,
      ]);
      const productsInsertQuery = format(
        'insert into products (title, description, price) values %L on conflict (title) do nothing RETURNING *',
        productsData,
      );

      const productRows = (await client.query(productsInsertQuery)).rows;

      if (!productRows.lengh) {
        console.log('all products from batch already exist');
        await client.query('COMMIT');
        return [];
      }

      const stocksData = productRows.map((product) => {
        const count = data.find((dataRow) => dataRow.title === product.title)
          .count;
        return [product.id, count];
      });

      const stocksInsertQuery = format(
        'insert into stocks (product_id, "count") values %L RETURNING "count"',
        stocksData,
      );

      const stockRows = (await client.query(stocksInsertQuery)).rows;

      await client.query('COMMIT');
      return productRows.map((productRow, i) => ({
        ...productRow,
        ...stockRows[i],
      }));
    } catch (err) {
      console.log('Error occurred during db request execution', err);
      await client.query('ROLLBACK');
      throw new Error('DB request execution error');
    } finally {
      await client.end();
    }
  }

  async _connect() {
    const client = new Client(dbOptions);
    await client.connect();
    return client;
  }
}

export const productPostgresRepository = new ProductPostgresRepository();
