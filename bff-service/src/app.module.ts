import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { CacheRequestService } from './services/cache-request.service';
import { CacheMiddleware } from './middlewares/cache.middleware';
import { ProxyRequestService } from './services/proxy.request.service';

const ENVIRONMENT = process.env.NODE_ENV || 'development';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.${ENVIRONMENT}.env`,
      ignoreEnvFile: ENVIRONMENT === 'production',
    }),
  ],
  controllers: [AppController],
  providers: [CacheRequestService, ProxyRequestService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CacheMiddleware).forRoutes(AppController);
  }
}
