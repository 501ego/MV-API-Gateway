import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    if (context.getType() === 'http') {
      const ctx = context.switchToHttp()
      const response = ctx.getResponse()
      const request = ctx.getRequest()
      const traceValue = request.headers.trace

      return next.handle().pipe(
        map((data) => {
          // check if 'data' already contains 'access_token' and other required fields
          console.log('Data received in response interceptor:', data)
          const hasRequiredFields =
            data?.access_token || data?.client || data?.email

          return {
            trace: traceValue,
            code: response.statusCode,
            message: 'successful',
            // if 'data' already contains 'access_token' and other required fields, return 'data' as is
            data: hasRequiredFields ? data : data?.data,
            pagination: data?.meta || data?.pagination,
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
