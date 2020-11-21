import { productsService } from '../services/products-service';
import { notificationService } from '../services/notification-service';

export async function catalogBatchProcess(event) {
  try {
    const data = event.Records.map((record) => JSON.parse(record.body));

    const createdProducts = await productsService.createProductsBatch(data);

    if (createdProducts && createdProducts.length) {
      await Promise.all(
        createdProducts.map((product) =>
          notificationService.sendProductCreatedNotification(product),
        ),
      );
    }
  } catch (e) {
    console.log('Some error occured during insert of products batch', e);
    throw e;
  }
}
