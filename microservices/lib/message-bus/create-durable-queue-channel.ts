import {rabbitChannelFactory} from './rabbit-channel-factory';
const queueName = 'durable';

export const getQueueName = () => queueName;

export const getChannel = async () => {
    let channel = await rabbitChannelFactory.getChannel();
    await channel.assertQueue(queueName, {durable: true});
    return channel;
};