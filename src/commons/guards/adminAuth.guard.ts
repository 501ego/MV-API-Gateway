import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'

@Injectable()
export class AdminAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest()
    const user = request.user

    if (!user) {
      throw new UnauthorizedException('No user attached to the request')
    }

    if (!user.isAdmin) {
      throw new UnauthorizedException('Access restricted to administrators')
    }

    return true
  }
}
