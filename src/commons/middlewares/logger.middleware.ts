import { Injectable, Logger, NestMiddleware } from '@nestjs/common'
import { NextFunction, Request, Response } from 'express'

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger()

  use(req: Request, res: Response, next: NextFunction) {
    res.on('finish', () => {
      if (res.statusCode < 200 || res.statusCode > 300) {
        this.logger.error(
          `[TraceId:${req.header('trace')}] - [${req.method}] ${
            req.url
          } - Status:${res.statusCode}`,
          res.statusMessage,
        )
      } else {
        this.logger.log(
          `[TraceId:${req.header('trace')}] - [${req.method}] ${
            req.url
          } - Status:${res.statusCode}`,
        )
      }
    })
    next()
  }
}
