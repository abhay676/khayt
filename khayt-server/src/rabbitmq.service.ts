import { Injectable, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class RabbitMQService {
  constructor(@Inject('rabbitmq') private readonly client: ClientProxy) {}

  public async send(pattern: string, data: any) {
    try {
      console.log('----------Shipping to the rocket-----------');
      return this.client.emit(pattern, JSON.stringify(data)).subscribe(() => {
        console.log('------------Done with the queue--------');
      });
    } catch (error) {
      console.log('err: ', error);
    }
  }
}
