const amqp = require('amqplib');
const queueName = 'hello';

module.exports.getQueueName = () => queueName;

module.exports.getChannel = async () => {
    let connection = await amqp.connect('amqp://guest:guest@rabbitmq');
    let channel = await connection.createChannel();
    await channel.assertQueue(queueName, {durable: false});
    return channel;
};