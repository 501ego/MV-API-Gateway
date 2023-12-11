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
export class AdminAuthService {
  constructor(
    @Inject('DATA_HANDLER_SERVICE') private dataHandler: ClientProxy,
    private jwtService: JwtService,
  ) {}

  async create(
    rut: string,
    name: string,
    email: string,
    password: string,
    isAdmin: boolean,
  ): Promise<any> {
    const saltOrRounds = 10
    const hash = await bcrypt.hash(password, saltOrRounds)

    const emailCheckResponse = await firstValueFrom(
      this.dataHandler.send({ cmd: 'find-employee-by-email' }, { email }),
    )

    if (emailCheckResponse.data.status !== 'not found') {
      throw new ConflictException('Email already exists in database')
    }

    try {
      const createResponse = await firstValueFrom(
        this.dataHandler.send(
          { cmd: 'create-employee' },
          { rut, name, email, password: hash, isAdmin },
        ),
      )
      const payload = { email, sub: createResponse.id }
      const access_token = this.jwtService.sign(payload)

      return { ...createResponse, access_token }
    } catch (createError) {
      console.error('Error creating employee:', createError.message)
      throw new InternalServerErrorException('Failed to create employee')
    }
  }

  async signin(email: string, password: string): Promise<any> {
    const employee = await firstValueFrom(
      this.dataHandler.send({ cmd: 'find-employee-by-email' }, { email }),
    )

    if (employee.data.data === null || !employee) {
      throw new ConflictException('Email does not exist in database')
    }
    const employeePassword = employee.data.data.password
    const isAdmin = employee.data.data.isAdmin

    const match = await bcrypt.compare(password, employeePassword)
    if (!match) {
      console.error('Password does not match. Input password:', password)
      console.error('Hashed password from the database:', employee.password)
      throw new ConflictException('Password does not match')
    }
    const payload = { email, sub: employee.data.data.id, isAdmin }
    const access_token = this.jwtService.sign(payload)

    return { ...employee, access_token }
  }
}
