import { IsNumber, IsString, IsDate, IsOptional } from 'class-validator'

export class CreateLoanDto {
  @IsNumber()
  clientId: number

  @IsNumber()
  amount: number

  @IsNumber()
  interest: number

  @IsNumber()
  @IsOptional()
  total: number

  @IsDate()
  @IsOptional()
  date: Date

  @IsString()
  @IsOptional()
  status: string

  @IsNumber()
  @IsOptional()
  payment: number
}
