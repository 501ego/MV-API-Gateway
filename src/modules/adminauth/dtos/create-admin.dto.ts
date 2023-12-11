import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsBoolean,
} from 'class-validator'

export class CreateAdminDto {
  @IsString()
  @IsNotEmpty()
  rut: string

  @IsString()
  @IsOptional()
  name: string

  @IsEmail()
  @IsNotEmpty()
  email: string

  @IsString()
  @IsNotEmpty()
  password: string

  @IsBoolean()
  @IsOptional()
  isAdmin: boolean
}
