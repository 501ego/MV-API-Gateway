import { Module } from '@nestjs/common'
import { MiddlewareConsumer, RequestMethod } from '@nestjs/common'
import { LoggerMiddleware } from './commons/middlewares/logger.middleware'
import { TraceMiddleware } from './commons/middlewares/trace.middleware'
import cookieSession = require('cookie-session')
import { APP_PIPE, APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { ResponseInterceptor } from './commons/interceptors/response.interceptor'
import { AuthModule } from './modules/auth/auth.module'
import { RpcExceptionsFilter } from './commons/filters/exception.filter'
@Module({
  imports: [AuthModule],
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
    {
      provide: APP_FILTER,
      useClass: RpcExceptionsFilter,
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
