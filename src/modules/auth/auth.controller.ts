import { Body, Controller, Post, Get, Session, UseGuards } from '@nestjs/common'
import { AuthService } from './auth.service'
import { JwtAuthGuard } from '../../commons/guards/auth.guard'
import { CurrentClient } from '../../commons/decorators/current-client.decorator'
import { LoginDto } from './dtos/login.dto'
import { ClientDto } from './dtos/client.dto'
import { Serialize } from 'src/commons/interceptors/serialize.interceptor'
import { SignupDto } from './dtos/signup.dto'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('/test')
  test() {
    return this.authService.test()
  }

  @Serialize(ClientDto)
  @Post('/signup')
  async signup(
    @Body() body: SignupDto,
  ): Promise<{ client: ClientDto; access_token: string }> {
    const result = await this.authService.signup(
      body.name,
      body.email,
      body.password,
    )
    return {
      client: result.data,
      access_token: result.access_token,
    }
  }

  @Serialize(ClientDto)
  @Post('/signin')
  async signin(
    @Body() body: LoginDto,
  ): Promise<{ client: ClientDto; access_token: string }> {
    const result = await this.authService.signin(body.email, body.password)
    return {
      client: result.data,
      access_token: result.access_token,
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('/whoami')
  whoAmI(@CurrentClient() client: any): any {
    return client
  }

  @Post('/signout')
  signout(@Session() session: any): void {
    session.clientId = null
    // Aquí podrías querer invalidar el token JWT si estás manteniendo una lista negra de tokens
  }
}
