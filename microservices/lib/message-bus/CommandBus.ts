import * as uuid4 from 'uuid/v4';
import { IQueue } from './IQueue';
import { Channel } from 'amqplib';

export class CommandBus {
    private channelFactory: IQueue;

    constructor(channelFactory: IQueue) {
        this.channelFactory = channelFactory;
    }

    private async connect(commandName: string): Promise<Channel> {
        return await this.channelFactory.configureQueue(commandName); 
    }

    public async sendCommand(commandName: string, payload): Promise<string> {
        let id = uuid4();
        payload.id = id;
        let channel = await this.connect(commandName);
        let sPayload = JSON.stringify(payload);
        let sendResult = channel.sendToQueue(
            this.channelFactory.getEventQueueName(commandName), 
            new Buffer(sPayload),
            { persistent: true}
        );
        console.log('[+] Sent command', commandName, sPayload, sendResult);
        return id;
    }

    public async addCommandHandler(commandName: string, handler) {
        let channel = await this.connect(commandName);
        console.log('[*] Waiting for commands %s. To exit press CTRL+C', commandName);
        
        return await channel.consume(this.channelFactory.getEventQueueName(commandName), async (msg) => {
            let content = msg.content.toString();
            console.log('\t[x] Received command', commandName, content);
            try {
                let payload = JSON.parse(content);
                await handler(payload);
                setTimeout(() => {
                    channel.ack(msg);
                    console.log('\t[x] Acked command', commandName, content);
                }, 0);
            } catch (err) {
                console.error(err.toString());
                setTimeout(() => {
                    channel.reject(msg, false);
                    console.log('\t[-] Rejected command', commandName, content);
                }, 1000);
            }
        }, {noAck: false});
    }
}
