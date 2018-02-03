import * as amqp from 'amqplib';
import { Channel } from 'amqplib';

export class RabbitChannelFactory {
    public async getChannel(): Promise<Channel> {
        let connection = await amqp.connect('amqp://guest:guest@rabbitmq');
        return await connection.createChannel();
    }
}