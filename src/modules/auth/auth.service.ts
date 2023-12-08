import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common'
import * as bcrypt from 'bcrypt'
import { firstValueFrom } from 'rxjs'
import { Inject } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'

@Injectable()
export class AuthService {
  constructor(
    @Inject('DATA_HANDLER_SERVICE') private dataHandlerClient: ClientProxy,
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
      return createResponse
    } catch (createError) {
      console.error('Error creating client:', createError.message)
      throw new InternalServerErrorException('Failed to create client')
    }
  }

  async signin(email: string, password: string): Promise<any> {
    const client = await firstValueFrom(
      this.dataHandlerClient.send({ cmd: 'find-client-by-email' }, { email }),
    )

    if (!client) {
      throw new ConflictException('Email does not exist in database')
    }
    const clientPassword = client.data.data.password

    const match = await bcrypt.compare(password, clientPassword)
    if (!match) {
      console.error('Password does not match. Input password:', password)
      console.error('Hashed password from the database:', client.password)
      throw new ConflictException('Password does not match')
    }
    return client
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
