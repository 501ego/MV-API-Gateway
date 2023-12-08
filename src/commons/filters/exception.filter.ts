import { Catch, RpcExceptionFilter, ArgumentsHost } from '@nestjs/common'
import { Observable, throwError } from 'rxjs'
import { RpcException } from '@nestjs/microservices'

@Catch(RpcException)
export class RpcExceptionsFilter implements RpcExceptionFilter<RpcException> {
  catch(exception: RpcException, host: ArgumentsHost): Observable<any> {
    const rpcContext = host.switchToRpc()
    const data = rpcContext.getData()
    const traceValue = data?.trace

    const errorResponse = {
      trace: traceValue,
      error: exception.getError(),
    }
    return throwError(() => errorResponse)
  }
}
