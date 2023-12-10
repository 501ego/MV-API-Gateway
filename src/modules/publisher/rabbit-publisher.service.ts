import { Injectable } from '@nestjs/common'
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices'

@Injectable()
export class RabbitPublisherService {
  private client: ClientProxy

  constructor() {
    this.client = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://localhost:5672'],
        queue: 'logs_queue',
        queueOptions: {
          durable: false,
        },
      },
    })
  }

  async publishLogMessage(logMessage: string) {
    await this.client.emit('log_exchange', logMessage).toPromise()
  }
}
