import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe, BadRequestException } from '@nestjs/common'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.setGlobalPrefix('api/v1')
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (errors) => {
        const messages = errors.map((error) => ({
          property: error.property,
          errors: Object.values(error.constraints),
        }))
        return new BadRequestException(messages)
      },
    }),
  )
  await app.listen(3000)
}
bootstrap()
