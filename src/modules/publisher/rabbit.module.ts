import { Module } from '@nestjs/common'
import { RabbitPublisherService } from './rabbit-publisher.service'

@Module({
  providers: [RabbitPublisherService],
  exports: [RabbitPublisherService],
})
export class RabbitMQModule {}
