import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    if (context.getType() === 'http') {
      const ctx = context.switchToHttp()
      const response = ctx.getResponse()
      const request = ctx.getRequest()
      const traceValue = request.headers.trace

      return next.handle().pipe(
        map((data) => {
          return {
            trace: traceValue,
            code: response.statusCode,
            message: 'successful',
            data:
              data && typeof data === 'object' && Object.keys(data).length > 0
                ? data.data
                : undefined,
            pagination: data?.meta
              ? data.meta
              : data?.pagination
                ? data.pagination
                : undefined,
          }
        }),
      )
    } else if (context.getType() === 'rpc') {
      const rpcContext = context.switchToRpc()
      const data = rpcContext.getData()
      const traceValue = data?.trace
      return next.handle().pipe(
        map((responseData) => {
          return {
            trace: traceValue,
            data: responseData || {},
          }
        }),
      )
    }
  }
}
