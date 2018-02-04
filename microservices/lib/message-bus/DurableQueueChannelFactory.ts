
import { IQueue } from './IQueue';
import { Channel } from 'amqplib';
import { RabbitChannelFactory } from './RabbitChannelFactory';

export class DurableQueueChannelFactory implements IQueue {
    // each command type has own channel and queue
    private channels = {};
    private channelFactory: RabbitChannelFactory;
    private readonly QUEUE_PREFIX = 'durable';

    constructor(rabbitChannelFactory: RabbitChannelFactory) {
        this.channelFactory = rabbitChannelFactory;
    }

    public getEventQueueName(eventName: string): string {
        return `${this.QUEUE_PREFIX}.${eventName}`;
    }

    public async configureQueue(eventName: string): Promise<Channel> {
        let channel = this.channels[eventName];
        if (!channel) {
            channel = await this.channelFactory.getChannel();
            console.log(`[*] Assert queue: ${this.getEventQueueName(eventName)}`);
            await channel.assertQueue(
                this.getEventQueueName(eventName),
                { durable: true },
            );
            this.channels[eventName] = channel;
        }
        return channel;
    }

    public async sendEvent(eventdName: string, payload: any): Promise<boolean> {
        let channel = await this.configureQueue(eventdName);
        let sPayload = JSON.stringify(payload);
        let sendResult = channel.sendToQueue(
            this.getEventQueueName(eventdName),
            new Buffer(sPayload),
            { persistent: true },
        );
        console.log('[+] Sent event', eventdName, sendResult);
        return sendResult;
    }

    public async handleEvent(eventName: string, handler) {
        let channel = await this.configureQueue(eventName);

        let consumeResult = await channel.consume(this.getEventQueueName(eventName), async (msg) => {
            let content = msg.content.toString();
            console.log('\t[x] Received event', eventName);
            try {
                let payload = JSON.parse(content);
                await handler(payload);
                setTimeout(() => {
                    channel.ack(msg);
                    console.log('\t[x] Acked event', eventName);
                }, 0);
            } catch (err) {
                setTimeout(() => {
                    // false = no requeue
                    channel.reject(msg, false);
                    console.error('\t[-] Rejected event', eventName, err.toString());
                }, 1000);
            }
        }, { noAck: false });
        console.log(`[*] Event handler started: ${eventName}`);
    }
}
