import {
  Injectable,
  InternalServerErrorException,
  ConflictException,
} from '@nestjs/common'
//import { ClientProxy } from '@nestjs/microservices'
import * as bcrypt from 'bcrypt'
import { HttpService } from '@nestjs/axios'
import { firstValueFrom } from 'rxjs'
import * as dotenv from 'dotenv'

dotenv.config()
@Injectable()
export class AuthService {
  constructor(
    private httpService: HttpService, // Inject HttpService here
    //@Inject('DATA_HANDLER_SERVICE') private dataHandlerClient: ClientProxy,
  ) {}

  async signup(name: string, email: string, password: string): Promise<any> {
    const saltOrRounds = 10
    const hash = await bcrypt.hash(password, saltOrRounds)
    const emailExist = await firstValueFrom(
      this.httpService.get(
        `${process.env.DB_HANDLER_ENDPOINT}/clients/email/${email}`,
      ),
    )
    if (emailExist.data.data) {
      throw new ConflictException('Email already exists in database')
    }

    try {
      const createResponse = await firstValueFrom(
        this.httpService.post(
          `${process.env.DB_HANDLER_ENDPOINT}/clients/create`,
          { name, email, password: hash },
        ),
      )
      return createResponse.data.data
    } catch (createError) {
      console.error(
        'Error creating client:',
        createError.response?.data || createError.message,
      )
      throw new InternalServerErrorException('Failed to create client')
    }
  }

  async signin(email: string, password: string): Promise<any> {
    const client = await firstValueFrom(
      this.httpService.get(
        `${process.env.DB_HANDLER_ENDPOINT}/clients/email/${email}`,
      ),
    )
    if (!client.data.data) {
      throw new ConflictException('Email does not exist in database')
    }
    const match = await bcrypt.compare(password, client.data.data.password)
    if (!match) {
      throw new ConflictException('Password does not match')
    }
    return client.data.data
  }
}
