import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class RabbitMQService {
  constructor(@Inject('rabbitmq') private readonly client: ClientProxy) {}

  public send(pattern: string, data: any) {
    console.log('Shipping to the rocket');
    return this.client.send(pattern, data);
  }
}
