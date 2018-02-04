import { Channel } from 'amqplib';

export interface IQueue {
    sendEvent(eventdName: string, payload): Promise<boolean>;
    handleEvent(eventName: string, handler);
}