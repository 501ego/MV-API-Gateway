import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common'
import * as bcrypt from 'bcrypt'
import { firstValueFrom } from 'rxjs'
import { Inject } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class AuthService {
  constructor(
    @Inject('DATA_HANDLER_SERVICE') private dataHandlerClient: ClientProxy,
    private jwtService: JwtService,
  ) {}

  async signup(name: string, email: string, password: string): Promise<any> {
    const saltOrRounds = 10
    const hash = await bcrypt.hash(password, saltOrRounds)

    const emailCheckResponse = await firstValueFrom(
      this.dataHandlerClient.send({ cmd: 'find-client-by-email' }, { email }),
    )

    if (emailCheckResponse.data.status !== 'not found') {
      throw new ConflictException('Email already exists in database')
    }

    try {
      const createResponse = await firstValueFrom(
        this.dataHandlerClient.send(
          { cmd: 'create-client' },
          { name, email, password: hash },
        ),
      )
      const payload = { email, sub: createResponse.id }
      const access_token = this.jwtService.sign(payload)

      return { ...createResponse, access_token }
    } catch (createError) {
      console.error('Error creating client:', createError.message)
      throw new InternalServerErrorException('Failed to create client')
    }
  }

  async signin(email: string, password: string): Promise<any> {
    const client = await firstValueFrom(
      this.dataHandlerClient.send({ cmd: 'find-client-by-email' }, { email }),
    )

    if (client.data.data === null || !client) {
      throw new ConflictException('Email does not exist in database')
    }
    const clientPassword = client.data.data.password

    const match = await bcrypt.compare(password, clientPassword)
    if (!match) {
      console.error('Password does not match. Input password:', password)
      console.error('Hashed password from the database:', client.password)
      throw new ConflictException('Password does not match')
    }
    const payload = { email, sub: client.data.data.id }
    const access_token = this.jwtService.sign(payload)

    return { ...client, access_token }
  }

  test() {
    return this.dataHandlerClient.send(
      { cmd: 'test' },
      {
        status: true,
        message: `MENSAJE DESDE LA API GATEWAY ${new Date().getSeconds()}`,
      },
    )
  }
}
