import { productsService } from '../services/products-service';
import { notificationService } from '../services/notification-service';

export async function catalogBatchProcess(event) {
  console.log('catalogBatchProcess called with', event.Records);

  try {
    const data = event.Records.map((record) => JSON.parse(record.body));

    const createdProducts = await productsService.createProductsBatch(data);

    if (createdProducts && createdProducts.length) {
      await Promise.all(
        createdProducts.map(notificationService.sendProductCreatedNotification),
      );
    }
  } catch (e) {
    console.log('Some error occured during insert of products batch', e);
    throw e;
  }
}
