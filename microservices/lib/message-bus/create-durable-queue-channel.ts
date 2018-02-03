import { DurableQueueChannelFactory } from './DurableQueueChannelFactory';
import { rabbitChannelFactory } from './rabbit-channel-factory';

export const factory = new DurableQueueChannelFactory(rabbitChannelFactory);