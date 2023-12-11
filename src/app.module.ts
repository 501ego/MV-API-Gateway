import { Module } from '@nestjs/common'
import { MiddlewareConsumer, RequestMethod } from '@nestjs/common'
import { LoggerMiddleware } from './commons/middlewares/logger.middleware'
import { TraceMiddleware } from './commons/middlewares/trace.middleware'
import { APP_PIPE, APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { ResponseInterceptor } from './commons/interceptors/response.interceptor'
import { AuthModule } from './modules/auth/auth.module'
import { RpcExceptionsFilter } from './commons/filters/exception.filter'
import { RabbitMQModule } from './modules/publisher/rabbit.module'
import { AdminAuthModule } from './modules/adminauth/adminAuth.module'
import { LoansModule } from './modules/loan/loan.module'
@Module({
  imports: [AuthModule, AdminAuthModule, RabbitMQModule, LoansModule],
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
    consumer
      .apply(TraceMiddleware, LoggerMiddleware)
      .forRoutes({ path: '/**', method: RequestMethod.ALL })
  }
}
