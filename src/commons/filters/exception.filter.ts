import {
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common'
import { HttpAdapterHost } from '@nestjs/core'
import { AxiosError } from 'axios'
import { ExceptionResponse } from '../interfaces/exception-response.interface'

@Catch()
export class ExceptionFilter implements ExceptionResponse {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}
  private readonly logger = new Logger()

  error: any
  trace: string
  code: number
  message: string

  catch(exception: any, host: ArgumentsHost): void {
    // In certain situations `httpAdapter` might not be available in the
    // constructor method, thus we should resolve it here.
    const { httpAdapter } = this.httpAdapterHost

    const ctx = host.switchToHttp()
    const request = ctx.getRequest()

    this.trace = request.header('trace')

    let httpStatus = HttpStatus.INTERNAL_SERVER_ERROR
    this.code = httpStatus

    if (exception instanceof HttpException) {
      httpStatus = exception.getStatus()
      this.code = httpStatus
      this.error = exception.message
    } else if (exception instanceof AxiosError && exception.response) {
      const { data } = exception.response
      const code = data?.code || data?.statusCode
      httpStatus = code
      this.code = httpStatus
      this.error = data?.error || data?.message
    } else if (exception instanceof Error) {
      this.message = exception.message
      this.error = exception.stack
    } else {
      this.message = exception.name
      this.error = exception.message
    }

    this.logger.error(
      `[TraceId:${this.trace}] - [${request.socket.parser.incoming.method}] ${request.socket.parser.incoming.url} - Status:${httpStatus}`,
      this.error,
    )

    const responseBody: ExceptionResponse = {
      code: this.code,
      trace: this.trace,
      message: this.message,
      error: this.error,
    }

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus)
  }
}
