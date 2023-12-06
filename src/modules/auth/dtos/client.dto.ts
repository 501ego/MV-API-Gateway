import { Exclude, Expose } from 'class-transformer'

export class ClientDto {
  @Expose()
  id: number

  @Expose()
  name: string

  @Expose()
  email: string

  @Exclude()
  password: string

  constructor(partial: Partial<ClientDto>) {
    Object.assign(this, partial)
  }
}
