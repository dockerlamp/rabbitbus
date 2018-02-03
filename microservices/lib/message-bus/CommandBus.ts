import { v4 as uuid4 } from 'uuid';
import { IQueue } from './IQueue';
import { Channel } from 'amqplib';

export class CommandBus {
    private channelFactory: IQueue;

    constructor(channelFactory: IQueue) {
        this.channelFactory = channelFactory;
    }

    public async sendCommand(commandName: string, payload): Promise<string> {
        payload.id = uuid4();
        await this.channelFactory.sendEvent(commandName, payload);
        console.log('\t[x] Sent command', commandName, payload.id);
        
        return payload.id;
    }

    public async addCommandHandler(commandName: string, handler) {
        await this.channelFactory.handleEvent(commandName, async (payload) => {
            console.log('\t[x] Received command', commandName, payload.id);
            await handler(payload);
        });
    }
}
