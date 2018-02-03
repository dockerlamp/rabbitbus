console.log('Consumer started');

const stats = require('measured').createCollection();

import { factory as durableChannel }  from '../lib/message-bus/create-durable-queue-channel';
import { CommandBus } from '../lib/message-bus/CommandBus';

let startConsumer = async () => {
    let commandBus = new CommandBus(durableChannel);    
    await commandBus.addCommandHandler('hello.world.2', async (paylaod) => {
        throw new Error('error in hello world 2 handler');
        //stats.meter('consume.2').mark();
    });
    await commandBus.addCommandHandler('hello.world.3', async (paylaod) => {
        stats.meter('consume.3').mark();
    });
};

startConsumer()
    .then(() => {
        console.log('[*] consumer started');
        setInterval(() => {
            console.log('[=] consumer stats', stats.toJSON());
        }, 5000);
    } )
    .catch(err => console.error(err));