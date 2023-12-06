import {
  Body,
  Controller,
  Post,
  Get,
  Session,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthGuard } from '../../commons/guards/auth.guard'
import { CurrentClient } from '../../commons/decorators/current-client.decorator'
import { LoginDto } from './dtos/login.dto'
import { ClientDto } from './dtos/client.dto'
import { Serialize } from 'src/commons/interceptors/serialize.interceptor'
import { SignupDto } from './dtos/signup.dto'

@Serialize(ClientDto)
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(AuthGuard)
  @Get('/whoami')
  whoAmI(@CurrentClient() client: string): string {
    const data = 'Client ID:' + client
    return data
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('/signup')
  async signup(
    @Body() body: SignupDto,
    @Session() session: any,
  ): Promise<ClientDto> {
    const client = await this.authService.signup(
      body.name,
      body.email,
      body.password,
    )
    session.clientId = client.id
    return client
  }

  @HttpCode(HttpStatus.OK)
  @Post('/signin')
  async signin(
    @Body() body: LoginDto,
    @Session() session: any,
  ): Promise<ClientDto> {
    const client = await this.authService.signin(body.email, body.password)
    session.clientId = client.id
    return client
  }

  @Post('/signout')
  signout(@Session() session: any): void {
    session.clientId = null
  }
}
