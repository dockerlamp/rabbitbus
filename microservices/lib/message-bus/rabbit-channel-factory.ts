import * as amqp from 'amqplib';
import { Channel } from 'amqplib';

class RabbitChannelFactory {
    public async getChannel(): Promise<Channel> {
        let connection = await amqp.connect('amqp://guest:guest@rabbitmq');
        return await connection.createChannel();
    }
}

export const rabbitChannelFactory = new RabbitChannelFactory();