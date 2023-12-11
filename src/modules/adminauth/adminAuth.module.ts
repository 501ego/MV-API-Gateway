import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { StrategiesModule } from 'src/commons/strategies/strategies.module'
import { JwtModule } from '@nestjs/jwt'
import { AdminAuthService } from './adminAuth.service'
import { AdminAuthController } from './adminAuth.controller'

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '5h' },
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
    ConfigModule,
    StrategiesModule,
  ],
  controllers: [AdminAuthController],
  providers: [AdminAuthService],
})
export class AdminAuthModule {}
