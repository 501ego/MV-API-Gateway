import { Module } from '@nestjs/common'
import { HttpModule } from '@nestjs/axios'
import { ConfigModule } from '@nestjs/config'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { StrategiesModule } from 'src/commons/strategies/strategies.module'
import { JwtModule } from '@nestjs/jwt'

@Module({
  imports: [
    HttpModule,
    ConfigModule,
    StrategiesModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '180s' },
    }),
    ClientsModule.register([
      {
        name: 'DATA_HANDLER_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost:5672'],
          queue: 'db_queue',
          queueOptions: {
            durable: true,
          },
        },
      },
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
