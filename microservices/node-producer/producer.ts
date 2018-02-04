console.log('Producer started');

import {factory as channelFactory} from '../lib/message-bus/create-durable-queue-channel'; 

import { CommandBus } from '../lib/message-bus/CommandBus';

let startCommandBusProducer = async () => {
    let commandBus = new CommandBus(channelFactory);
    for(let i = 0; i < 10; i++) {
        let payloadV2 = {
            valueV2: 'Hello World! ' + Math.round(Math.random()*1000),
            count: i,
        };
        await commandBus.sendCommand('hello.world.2', payloadV2);
        let payloadV3 = {
            valueV3: 'Hello World! ' + Math.round(Math.random()*1000),
            count: i,
        };
        await commandBus.sendCommand('hello.world.3', payloadV3);
    }
}

startCommandBusProducer()
    .then(() => {
        console.log('[*] producer done');
    })
    .catch(err => console.error('[-] start producer error', err));