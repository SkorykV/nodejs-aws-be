import AWS from 'aws-sdk';
import csv from 'csv-parser';
import { pipeline } from 'stream';

class ParseService {
  constructor() {
    this._s3 = new AWS.S3({ region: 'eu-west-1' });
    this._sqs = new AWS.SQS();
  }
  async process(bucket, key, parsedFilesFolder) {
    try {
      await this._parseFile(bucket, key);
      await this._moveUploadedObjectTo(bucket, key, parsedFilesFolder);
    } catch (e) {
      console.log('Some Error occurred on file processing', e);
    }
  }

  _parseFile(bucket, key) {
    console.log(`Start parsing of ${key}`);
    const params = {
      Bucket: bucket,
      Key: key,
    };

    const sqsPromises = [];

    const parsingTransformStream = csv({
      strict: true,
      mapValues: ({ header, index, value }) => {
        if (header === 'price' || header === 'count') {
          return parseInt(value);
        }
        return value;
      },
    }).on('data', (row) => {
      sqsPromises.push(this._sendProductToQueue(row));
      console.log(row, 'was parsed');
    });

    return new Promise((resolve, reject) => {
      pipeline(
        this._s3.getObject(params).createReadStream(),
        parsingTransformStream,
        async (err) => {
          if (err) {
            console.log('Parsing Error occurred', err);
            return reject(err);
          }
          await Promise.all(sqsPromises);
          console.log(`Finished parsing of ${key}`);
          resolve();
        },
      );
    });
  }

  async _moveUploadedObjectTo(bucket, key, destFolder) {
    await this._s3
      .copyObject({
        Bucket: bucket,
        CopySource: `/${bucket}/${key}`,
        Key: key.replace(/^uploaded/, destFolder),
      })
      .promise();

    console.log(`Moved ${key} to "parsed" folder`);

    await this._s3
      .deleteObject({
        Bucket: bucket,
        Key: key,
      })
      .promise();

    console.log(`Deleted ${key} from "uploaded" folder`);
  }

  async _sendProductToQueue(productData) {
    await this._sqs
      .sendMessage({
        QueueUrl: process.env.SQS_URL,
        MessageBody: JSON.stringify(productData),
      })
      .promise();

    console.log(productData, 'sent to SQS');
  }
}

export const parseService = new ParseService();
