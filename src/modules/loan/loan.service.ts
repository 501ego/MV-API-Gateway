import { Injectable, Inject } from '@nestjs/common'
import { firstValueFrom } from 'rxjs'
import { ClientProxy } from '@nestjs/microservices'
import { CreateLoanDto } from './dtos/create-loan.dto'
import { LoanDto } from './dtos/loan.dto'

@Injectable()
export class LoanService {
  constructor(
    @Inject('DATA_HANDLER_SERVICE') private dataHandlerClient: ClientProxy,
  ) {}
  async create(createLoanDto: CreateLoanDto): Promise<LoanDto> {
    const loan = await firstValueFrom(
      this.dataHandlerClient.send({ cmd: 'create-loan' }, { createLoanDto }),
    )
    return loan.data
  }
}
