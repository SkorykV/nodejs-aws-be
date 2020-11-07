import { Client } from 'pg';

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

  async getProductByID(id) {
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
      const product = (
        await client.query(
          'insert into products (title, description, price) values ($1, $2, $3) RETURNING *',
          [productData.title, productData.description, productData.price],
        )
      ).rows[0];

      const stock = (
        await client.query(
          'insert into stocks (product_id, "count") values ($1, $2) RETURNING *',
          [product.id, productData.count],
        )
      ).rows[0];

      return { ...product, count: stock.count };
    } catch (err) {
      console.log('Error occurred during db request execution', err);
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
