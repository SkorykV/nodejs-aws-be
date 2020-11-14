import AWS from 'aws-sdk';
import { BaseError } from '../models/base-error';

class UploadService {
  async getSignedUrl(bucket, key, contentType) {
    const s3 = new AWS.S3({ region: 'eu-west-1', signatureVersion: 'v4' });
    const params = {
      Bucket: bucket,
      Key: key,
      Expires: 60 * 5,
      ContentType: contentType,
    };
    return await s3.getSignedUrlPromise('putObject', params);
  }
}

export const uploadService = new UploadService();
