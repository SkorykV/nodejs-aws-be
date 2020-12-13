import {
  Controller,
  All,
  Param,
  Req,
  Res,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import {
  CacheRequestService,
  ResponseCache,
} from './services/cache-request.service';
import {
  ProxiedRequestResponse,
  ProxyRequestService,
} from './services/proxy.request.service';

@Controller()
export class AppController {
  constructor(
    private readonly cacheService: CacheRequestService,
    private readonly configService: ConfigService,
    private readonly proxyRequestService: ProxyRequestService,
  ) {}

  @All(':recipientService?')
  async processRequest(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Param() params,
  ) {
    const recepientURL = this.configService.get(params.recipientService);
    if (!recepientURL) {
      throw new HttpException('Cannot process request', HttpStatus.BAD_GATEWAY);
    }

    const recepientResponse: ProxiedRequestResponse = await this.proxyRequestService.getResponseFromRecipient(
      recepientURL,
      req,
    );

    if (req.method === 'GET') {
      const responseCache: ResponseCache = {
        status: recepientResponse.response.status,
        data: recepientResponse.response.data,
      };
      this.cacheService.saveResponse(req, responseCache, 60 * 2);
    }

    res.status(recepientResponse.response.status);
    return recepientResponse.response.data;
  }
}