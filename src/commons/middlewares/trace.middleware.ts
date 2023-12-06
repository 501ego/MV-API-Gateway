import { Injectable, NestMiddleware } from '@nestjs/common'
import { Request, Response, NextFunction } from 'express'
import { v4 as uuid } from 'uuid'

@Injectable()
export class TraceMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    if (typeof req.headers.trace === 'undefined') {
      req.headers.trace = uuid()
    }
    next()
  }
}
