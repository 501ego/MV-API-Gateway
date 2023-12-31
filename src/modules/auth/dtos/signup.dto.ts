import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class SignupDto {
  @IsString()
  @IsOptional()
  name: string

  @IsEmail()
  @IsNotEmpty()
  email: string

  @IsString()
  @IsNotEmpty()
  password: string
}
