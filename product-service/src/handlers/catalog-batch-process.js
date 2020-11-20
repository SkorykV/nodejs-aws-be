import { productsService } from '../services/products-service';

export async function catalogBatchProcess(event) {
  console.log('catalogBatchProcess called with', event.Records);

  try {
    const data = event.Records.map((record) => JSON.parse(record.body));

    await productsService.createProductsBatch(data);
  } catch (e) {
    console.log('Some error occured during insert of products batch', e);
    throw e;
  }
}
