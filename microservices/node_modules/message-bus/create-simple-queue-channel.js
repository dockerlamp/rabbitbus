const rabbitChannelFactory = require('./rabbit-channel-factory');
const queueName = 'simple';

module.exports.getQueueName = () => queueName;

module.exports.getChannel = async () => {
    let channel = await rabbitChannelFactory.getChannel();
    await channel.assertQueue(queueName, {durable: false});
    return channel;
};