const amqp = require('amqplib');

class RabbitChannelFactory {
    /**
     * @returns Bluebird<Channel>
     */
    async getChannel() {
        let connection = await amqp.connect('amqp://guest:guest@rabbitmq');
        return await connection.createChannel();
    }
}

module.exports = new RabbitChannelFactory();