import AWS from 'aws-sdk';

class NotificationService {
  sendProductCreatedNotification(product) {
    const sns = new AWS.SNS({ region: 'eu-west-1' });
    const message = `
          New product with ${product.id} id was added to database:
          Title - ${product.title}
          Description - ${product.description}
          Price - ${product.price}
          Count - ${product.count}
          `;
    return sns
      .publish({
        TopicArn: process.env.createProductTopicARN,
        Subject: 'New products created',
        Message: message,
        MessageAttributes: {
          price: {
            DataType: 'Number',
            StringValue: String(product.price),
          },
        },
      })
      .promise();
  }
}

export const notificationService = new NotificationService();
