import { productPostgresRepository } from '../product.postgres.repository';
import { Client } from 'pg';

jest.mock('pg', () => {
  const client = {
    connect: jest.fn(),
    end: jest.fn(),
    query: jest.fn(async (queryText) => {
      if (queryText.startsWith('insert into products')) {
        return {
          rows: [
            {
              id: '1',
              title: 'test1',
              description: 'test description1',
              price: 123,
            },
            {
              id: '2',
              title: 'test2',
              description: 'test description2',
              price: 123,
            },
          ],
        };
      } else if (queryText.startsWith('insert into stocks')) {
        return {
          rows: [
            {
              count: 3,
            },
            {
              count: 3,
            },
          ],
        };
      }
    }),
  };
  function ClientConstructorMock() {
    console.log('ClientConstructorMock');
    return client;
  }
  return {
    Client: ClientConstructorMock,
  };
});

describe('productPostgresRepository', () => {
  let productsMock;
  let dbClient;
  beforeEach(() => {
    productsMock = [
      {
        title: 'test1',
        description: 'test description1',
        price: 123,
        count: 3,
      },
      {
        title: 'test2',
        description: 'test description2',
        price: 123,
        count: 3,
      },
    ];

    dbClient = new Client();
  });
  test('should create successfull transaction, when correct data was passed', async () => {
    await productPostgresRepository.createProductsBatch(productsMock);

    expect(dbClient.query.mock.calls).toEqual([
      ['BEGIN'],
      [
        "insert into products (title, description, price) values ('test1', 'test description1', '123'), ('test2', 'test description2', '123') on conflict (title) do nothing RETURNING *",
      ],
      [
        "insert into stocks (product_id, \"count\") values ('1', '3'), ('2', '3') RETURNING \"count\"",
      ],
      ['COMMIT'],
    ]);

    expect(dbClient.connect).toBeCalled();
    expect(dbClient.end).toBeCalled();
  });

  test('should not execute query to stocks table, if no products were created', async () => {
    dbClient.query.mockImplementation((queryText) => {
      if (queryText.startsWith('insert into products')) {
        return { rows: [] };
      }
    });

    await productPostgresRepository.createProductsBatch(productsMock);

    expect(dbClient.query.mock.calls).toEqual([
      ['BEGIN'],
      [
        "insert into products (title, description, price) values ('test1', 'test description1', '123'), ('test2', 'test description2', '123') on conflict (title) do nothing RETURNING *",
      ],
      ['COMMIT'],
    ]);

    expect(dbClient.connect).toBeCalled();
    expect(dbClient.end).toBeCalled();
  });

  test('should rollback transaction and throw an error if one of queries throws an error', async () => {
    expect.assertions(4);
    dbClient.query.mockImplementation(async (queryText) => {
      if (queryText.startsWith('insert into products')) {
        throw new Error('Random DB error');
      }
    });

    try {
      await productPostgresRepository.createProductsBatch(productsMock);
    } catch (e) {
      expect(e).toBeDefined();
    }

    expect(dbClient.connect).toBeCalled();
    expect(dbClient.end).toBeCalled();

    expect(dbClient.query.mock.calls).toEqual([
      ['BEGIN'],
      [
        "insert into products (title, description, price) values ('test1', 'test description1', '123'), ('test2', 'test description2', '123') on conflict (title) do nothing RETURNING *",
      ],
      ['ROLLBACK'],
    ]);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
