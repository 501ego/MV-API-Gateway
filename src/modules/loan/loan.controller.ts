import {
  Body,
  Controller,
  Post,
  UseGuards,
  Get,
  Param,
  Patch,
} from '@nestjs/common'
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

  @UseGuards(JwtAuthGuard)
  @Get('/my-loans')
  async getLoansByClient(@CurrentClient() client): Promise<LoanDto[]> {
    const clientId = parseInt(client.sub)
    return await this.loanService.findByClient(clientId)
  }

  @UseGuards(JwtAuthGuard)
  @Get('/loan/:id')
  async getLoanById(@Param() params): Promise<LoanDto> {
    const loanId = parseInt(params.id)
    return await this.loanService.findOne(loanId)
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/pay/:id')
  async payLoan(@Param() params, @Body() body): Promise<LoanDto> {
    const loanId = parseInt(params.id)
    return await this.loanService.payLoan(loanId, body)
  }
}
