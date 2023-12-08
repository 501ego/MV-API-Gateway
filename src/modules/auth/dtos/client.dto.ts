import { Exclude } from 'class-transformer'

export class ClientDto {
  id: number
  name: string
  email: string

  @Exclude()
  password: string

  constructor(partial: Partial<ClientDto>) {
    Object.assign(this, partial)
  }
}
