import { Module } from '@nestjs/common'
import { MiddlewareConsumer, RequestMethod } from '@nestjs/common'
import { LoggerMiddleware } from './commons/middlewares/logger.middleware'
import { TraceMiddleware } from './commons/middlewares/trace.middleware'
import cookieSession = require('cookie-session')
import { APP_PIPE } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { APP_INTERCEPTOR } from '@nestjs/core'
import { ResponseInterceptor } from './commons/interceptors/response.interceptor'
import { AuthModule } from './modules/auth/auth.module'
import { Transport, ClientsModule } from '@nestjs/microservices'
@Module({
  imports: [
    AuthModule,
    ClientsModule.register([
      {
        name: 'DATA_HANDLER_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost:5672'],
          queue: 'main_queue',
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
  ],
  providers: [
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(cookieSession({ keys: ['asdf'] })).forRoutes('*')
    consumer
      .apply(TraceMiddleware, LoggerMiddleware)
      .forRoutes({ path: '/**', method: RequestMethod.ALL })
  }
}