import { Injectable, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { CacheRequestService } from 'src/services/cache-request.service';

@Injectable()
export class CacheMiddleware implements NestMiddleware {
  constructor(
    private readonly cacheService: CacheRequestService,
    private readonly configService: ConfigService,
  ) {}

  async use(req: Request, res: Response, next: Function) {
    if (req.method === 'GET' && this.configService.get(req.baseUrl.slice(1))) {
      const cachedResponse = await this.cacheService.getResponse(req);
      if (cachedResponse) {
        console.log(`Return response for ${req.originalUrl} from cache`);
        res.status(cachedResponse.status).json(cachedResponse.data);
        return;
      }
    }
    next();
  }
}
