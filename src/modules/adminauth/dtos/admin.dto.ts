import { Exclude } from 'class-transformer'

export class AdminDto {
  rut: string
  id: number
  name: string
  email: string
  isAdmin: boolean
  @Exclude()
  password: string

  constructor(partial: Partial<AdminDto>) {
    Object.assign(this, partial)
  }
}
