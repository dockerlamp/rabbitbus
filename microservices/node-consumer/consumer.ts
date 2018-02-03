console.log('Consumer started');

const stats = require('measured').createCollection();

import { factory as durableChannel }  from '../lib/message-bus/create-durable-queue-channel';
import { CommandBus } from '../lib/message-bus/CommandBus';

let startConsumer = async (doAck) => {
    let commandBus = new CommandBus(durableChannel);    
    await commandBus.addCommandHandler('hello.world.2', async (paylaod) => {
        throw new Error('error in hello world 2 handler');
        stats.meter('consume.2').mark();
    });
    await commandBus.addCommandHandler('hello.world.3', async (paylaod) => {
        stats.meter('consume.3').mark();
    });
    // let channel = await durableChannel.getChannel();   
    // let queueName = durableChannel.getQueueName();
    // console.log('[*] Waiting for messages in %s. To exit press CTRL+C', queueName);
    
    // return await channel.consume(queueName, (msg) => {
    //     console.log('\t[x] Received %s', msg.content.toString());
    //     stats.meter('consume').mark();
    //     if (doAck) {
    //         setTimeout(() => {
    //             channel.ack(msg);
    //             console.log('\t[x] Acked %s', msg.content.toString());
    //         }, 0);
    //     }
    // }, {noAck: !doAck});
};

startConsumer(true)
    .then((val) => {
        console.log('consumer started', val);
        // setInterval(() => {
        //     console.log(stats.toJSON());
        // }, 5000);
    } )
    .catch(err => console.error(err));