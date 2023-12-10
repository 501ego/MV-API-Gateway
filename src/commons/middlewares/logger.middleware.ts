import { Injectable, Logger, NestMiddleware } from '@nestjs/common'
import { NextFunction, Request, Response } from 'express'
import { RabbitPublisherService } from '../../modules/publisher/rabbit-publisher.service'
@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger()
  private serviceName = 'api-gateway'
  constructor(private rabbitPublisher: RabbitPublisherService) {}
  use(req: Request, res: Response, next: NextFunction) {
    res.on('finish', () => {
      const logMessage = `[${this.serviceName}] [TraceId:${req.header(
        'trace',
      )}] - [${req.method}] ${req.url} - Status:${res.statusCode}`
      if (res.statusCode < 200 || res.statusCode > 300) {
        this.logger.error(logMessage)
      } else {
        this.logger.log(logMessage)
      }
      this.rabbitPublisher.publishLogMessage(logMessage).catch((error) => {
        this.logger.error('Failed to publish log message to RabbitMQ', error)
      })
    })
    next()
  }
}
