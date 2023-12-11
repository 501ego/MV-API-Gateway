import { Body, Controller, Post, Get, Session, UseGuards } from '@nestjs/common'
import { CurrentEmployee } from '../../commons/decorators/current-employee.decorator'
import { LoginDto } from '../auth/dtos/login.dto'
import { AdminAuthService } from './adminAuth.service'
import { AdminAuthGuard } from 'src/commons/guards/adminAuth.guard'
import { Serialize } from 'src/commons/interceptors/serialize.interceptor'
import { AdminDto } from './dtos/admin.dto'
import { CreateAdminDto } from './dtos/create-admin.dto'
import { AuthGuard } from '@nestjs/passport'

@Controller('admin/auth')
export class AdminAuthController {
  constructor(private readonly authService: AdminAuthService) {}

  @UseGuards(AuthGuard('jwt'), AdminAuthGuard)
  @Serialize(AdminDto)
  @Post('/create')
  async create(
    @Body() body: CreateAdminDto,
  ): Promise<{ employee: AdminDto; access_token: string }> {
    const result = await this.authService.create(
      body.rut,
      body.name,
      body.email,
      body.password,
      body.isAdmin,
    )
    return {
      employee: result.data,
      access_token: result.access_token,
    }
  }

  @Serialize(AdminDto)
  @Post('/signin')
  async signin(
    @Body() body: LoginDto,
  ): Promise<{ employee: AdminDto; access_token: string }> {
    const result = await this.authService.signin(body.email, body.password)
    return {
      employee: result.data,
      access_token: result.access_token,
    }
  }

  @UseGuards(AuthGuard('jwt'), AdminAuthGuard)
  @Get('/whoami')
  whoAmI(@CurrentEmployee() employee: any): any {
    return employee
  }

  @Post('/signout')
  signout(@Session() session: any): void {}
}
