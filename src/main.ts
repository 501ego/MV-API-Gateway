import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ExceptionFilter } from './commons/filters/exception.filter'
import { ValidationPipe } from '@nestjs/common'
import { HttpAdapterHost } from '@nestjs/core'
import { MicroserviceOptions, Transport } from '@nestjs/microservices'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://localhost:5672'],
      queue: 'main_queue',
      queueOptions: {
        durable: false,
      },
    },
  })
  app.useGlobalFilters(new ExceptionFilter(app.get(HttpAdapterHost)))
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  )
  await app.startAllMicroservices()
  await app.listen(3001)
  console.log(`Application is running on: ${await app.getUrl()}`)
}

bootstrap()
