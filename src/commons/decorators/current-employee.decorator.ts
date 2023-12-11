import { createParamDecorator, ExecutionContext } from '@nestjs/common'

export const CurrentEmployee = createParamDecorator(
  (data: never, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest()
    return request.user
  },
)
