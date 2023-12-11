import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { LoanService } from './loan.service'
import { CurrentClient } from 'src/commons/decorators/current-client.decorator'
import { CreateLoanDto } from './dtos/create-loan.dto'
import { LoanDto } from './dtos/loan.dto'
import { JwtAuthGuard } from '../../commons/guards/auth.guard'

@Controller('loans')
export class LoansController {
  constructor(private readonly loanService: LoanService) {}

  @UseGuards(JwtAuthGuard)
  @Post('/create')
  async createLoan(
    @Body() body: CreateLoanDto,
    @CurrentClient() client,
  ): Promise<LoanDto> {
    const clientId = client.sub
    body.clientId = clientId
    return await this.loanService.create(body)
  }
}
