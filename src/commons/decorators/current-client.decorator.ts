import { createParamDecorator, ExecutionContext } from '@nestjs/common'

export const CurrentClient = createParamDecorator(
  (data: never, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest()
    return request.session.clientId
  },
)
