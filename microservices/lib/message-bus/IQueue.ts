import { Channel } from 'amqplib';

export interface IQueue {

    getQueueName(): string

    getChannel(): Channel;
}