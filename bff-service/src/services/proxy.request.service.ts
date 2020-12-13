import { HttpException, Injectable } from '@nestjs/common';
import axios, { AxiosRequestConfig, AxiosResponse, Method } from 'axios';
import { Request } from 'express';
import { hasBody, mapHeaders } from 'src/helpers/request-helpers';

export interface ProxiedRequestResponse {
  requestConfig: AxiosRequestConfig;
  response: AxiosResponse<any>;
}

@Injectable()
export class ProxyRequestService {
  async getResponseFromRecipient(
    recepientURL: string,
    req: Request,
  ): Promise<ProxiedRequestResponse> {
    try {
      console.log(
        `Processing request to ${recepientURL} with path ${req.path}`,
      );
      const requestConfig = this.compileRequestConfig(recepientURL, req);
      const response = await axios(requestConfig);
      return { requestConfig, response };
    } catch (error) {
      if (error.isAxiosError) {
        throw new HttpException(
          error.response?.data?.message ||
            error.response?.data?.error ||
            error.response?.data,
          error.response?.status,
        );
      }
      throw error;
    }
  }

  private compileRequestConfig(
    recepientURL: string,
    req: Request,
  ): AxiosRequestConfig {
    const requestConfig: AxiosRequestConfig = {
      baseURL: recepientURL,
      url: req.path.slice(1),
      method: req.method as Method,
      headers: mapHeaders(req.headers, req.method),
      params: req.query,
    };

    if (hasBody(req.method)) {
      requestConfig.data = req.body;
    }
    return requestConfig;
  }
}
