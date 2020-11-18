import AWS from 'aws-sdk';
import csv from 'csv-parser';

class ParseService {
  constructor() {
    this._s3 = new AWS.S3({ region: 'eu-west-1' });
  }
  async process(bucket, key, parsedFilesFolder) {
    await this._parseFile(bucket, key);
    await this._moveUploadedObjectTo(bucket, key, parsedFilesFolder);
  }

  _parseFile(bucket, key) {
    console.log(`Start parsing of ${key}`);
    return new Promise((resolve, reject) => {
      const params = {
        Bucket: bucket,
        Key: key,
      };

      this._s3
        .getObject(params)
        .createReadStream()
        .pipe(
          csv({
            mapValues: ({ header, index, value }) => {
              if (header === 'Price' || header === 'Count') {
                return parseInt(value);
              }
              return value;
            },
          }),
        )
        .on('data', (row) => console.log(row))
        .on('error', (err) => {
          console.log('Error occurred', err);
          reject();
        })
        .on('end', () => {
          console.log(`Finished parsing of ${key}`);
          resolve();
        });
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
}

export const parseService = new ParseService();
