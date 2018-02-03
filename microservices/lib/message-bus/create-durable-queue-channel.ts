import {rabbitChannelFactory} from './rabbit-channel-factory';
import { IQueue } from './IQueue';
import { Channel } from 'amqplib';

class DurableQueueChannelFactory implements IQueue {
    private channels = {};
    
    public getEventQueueName(eventName: string): string {
        return `${this.getQueueName()}.${eventName}`;
    }

    public async configureQueue(eventName: string): Promise<Channel> {
        let channel = this.channels[eventName];
        if (!channel) {
            channel = await rabbitChannelFactory.getChannel();
            console.log(`[*] Assert queue: ${this.getEventQueueName(eventName)}`);
            await channel.assertQueue(this.getEventQueueName(eventName), {durable: true});
        }
        return channel;
    }

    private getQueueName(): string {
        return 'durable';
    }
}

export const factory = new DurableQueueChannelFactory();