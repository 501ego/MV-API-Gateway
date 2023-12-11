import { Expose } from 'class-transformer'

export class LoanDto {
  @Expose()
  id: number

  @Expose()
  clientId: number

  @Expose()
  amount: number

  @Expose()
  interest: number

  @Expose()
  total: number

  @Expose()
  date: Date

  @Expose()
  status: string

  @Expose()
  payment: number
}
