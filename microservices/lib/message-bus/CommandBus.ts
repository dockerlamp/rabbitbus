
export class CommandBus {
    private channel;
    private channelFactory;
    private queueName;

    constructor(channelFactory) {
        this.channel = null;
        this.channelFactory = channelFactory;
        this.queueName = channelFactory.getQueueName();
    }

    async connect() {
        if (!this.channel) {
            console.log('[=] Connecting to rabbit');
            this.channel = await this.channelFactory.getChannel();   
            
            console.log(`[=] CommandBus conneced to bus/queue "${this.queueName}"`);
        } else {
            //console.log(`[=] Producer already conneced to bus/queue "${queueName}"`);
        }
        return this.channel;
    }

    async sendCommand(commandName, payload) {
        let channel = await this.connect();
        let sendResult = channel.sendToQueue(this.queueName, new Buffer(payload.toString()), { persistent: true});
        console.log('[+] Sent', commandName, payload, sendResult);
    }

    addCommandHandler(commandName, handler) {
    }
}
