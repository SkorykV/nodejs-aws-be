import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import * as redis from 'redis';
import { IncomingHttpHeaders } from 'http';

export interface ResponseCache {
  status: number;
  data: any;
}

@Injectable()
export class CacheRequestService {
  private redisClient = redis.createClient(
    +this.configService.get('REDIS_PORT', 6379),
    this.configService.get('REDIS_HOST', 'localhost'),
  );

  constructor(private readonly configService: ConfigService) {
    this.redisClient.on('error', function (error) {
      if (error.code === 'ECONNREFUSED') {
        console.error('Can`t connect to the Redis cache', error);
        process.exit(1);
      }
    });
  }

  getResponse(request: Request): Promise<ResponseCache> {
    return new Promise((resolve, reject) => {
      console.log(
        `Attempt to read response for ${request.originalUrl} from cache`,
      );
      const cacheKey = this.generateCacheKey(request);
      this.redisClient.get(cacheKey, (err, data) => {
        if (err) {
          return reject(err);
        }
        resolve(data && JSON.parse(data));
      });
    });
  }

  saveResponse(
    request: Request,
    response: ResponseCache,
    expireInSecs: number,
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const cacheKey = this.generateCacheKey(request);
      this.redisClient.setex(
        cacheKey,
        expireInSecs,
        JSON.stringify({ status: response.status, data: response.data }),
        (err: Error) => {
          if (err) {
            reject(err);
          }
          console.log(
            `Saved response for ${request.originalUrl} in cache for ${expireInSecs} seconds`,
          );
          resolve();
        },
      );
    });
  }

  private generateCacheKey(request: Request): string {
    return JSON.stringify({
      url: request.originalUrl,
      headers: this.getCachableHeaders(request.headers),
    });
  }

  private getCachableHeaders({ authorization }: IncomingHttpHeaders) {
    return authorization ? { authorization } : {};
  }
}
