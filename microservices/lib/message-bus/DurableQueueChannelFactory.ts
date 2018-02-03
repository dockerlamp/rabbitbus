
import { IQueue } from './IQueue';
import { Channel } from 'amqplib';
import { RabbitChannelFactory } from './RabbitChannelFactory';

export class DurableQueueChannelFactory implements IQueue {
    private channels = {};
    private channelFactory: RabbitChannelFactory;

    constructor(rabbitChannelFactory: RabbitChannelFactory) {
        this.channelFactory = rabbitChannelFactory;
    }
    
    public getEventQueueName(eventName: string): string {
        return `${this.getQueueName()}.${eventName}`;
    }

    public async configureQueue(eventName: string): Promise<Channel> {
        let channel = this.channels[eventName];
        if (!channel) {
            channel = await this.channelFactory.getChannel();
            console.log(`[*] Assert queue: ${this.getEventQueueName(eventName)}`);
            await channel.assertQueue(this.getEventQueueName(eventName), {durable: true});
        }
        return channel;
    }

    private getQueueName(): string {
        return 'durable';
    }
}
