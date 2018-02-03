import { Channel } from 'amqplib';

export interface IQueue {

    // getQueueName(): string

    // configureQueue(eventName: string): Promise<Channel>;
    
    // getEventQueueName(eventName: string): string;

    sendEvent(eventdName: string, payload): Promise<boolean>;
    handleEvent(eventName: string, handler);
}