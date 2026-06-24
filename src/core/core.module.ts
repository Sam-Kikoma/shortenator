import { Global, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import config from '../config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TransformResponseInterceptor } from './interceptors/transform-response/transform-response.interceptor';
import { LoggerService } from './logger/logger.service';
import { LoggerMiddleware } from './middleware/logger/logger.middleware';
import { CacheModule } from '@nestjs/cache-manager';
import { DatabaseModule } from '../database/database.module';
import { createKeyv } from '@keyv/redis';
import { CacheService } from './cache/cache.service';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    DatabaseModule,
    CacheModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const host = configService.get<string>('redis.host', 'localhost');
        const port = configService.get<number>('redis.port', 6379);
        const username = configService.get<string>('redis.username');
        const password = configService.get<string>('redis.password');

        // Build the connection string
        let redisUrl = '';
        if (username && password) {
          redisUrl = `redis://${username}:${password}@${host}:${port}`;
        } else if (password) {
          redisUrl = `redis://:${password}@${host}:${port}`;
        } else {
          redisUrl = `redis://${host}:${port}`;
        }

        return {
          stores: [createKeyv(redisUrl)],
          ttl: 10000,
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformResponseInterceptor,
    },
    LoggerService,
    CacheService,
  ],
  exports: [LoggerService, CacheService],
})
export class CoreModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
