console.log('Producer started');

const retry = require('bluebird-retry');

import * as durableChannel from '../lib/message-bus/create-durable-queue-channel'; 

import { CommandBus } from '../lib/message-bus/CommandBus';

// let sendCommandCounter = 0;
// let sendHelloWorldCommand = async (channel, queueName) => {
//     sendCommandCounter++;
//     let obj = {
//         value: 'Hello World! ' + Math.round(Math.random()*1000),
//         count: sendCommandCounter
//     };
//     let payload = JSON.stringify(obj);
//     let sendResult = channel.sendToQueue(queueName, new Buffer(payload), { persistent: true});
//     console.log('[+] Sent', payload, sendResult);
// };

// let connectionCounter = 0;
// let startProducer = async () => {
//     let channel;   
//     let queueName;
//     let connect = async () => {
//         if (!channel) {
//             console.log('[=] Connecting to rabbit, try', ++connectionCounter);
//             channel = await messageBus.getChannel();   
//             queueName = messageBus.getQueueName();
//             console.log(`[=] Producer conneced to bus/queue "${queueName}"`);
//         } else {
//             //console.log(`[=] Producer already conneced to bus/queue "${queueName}"`);
//         }
//     };
//     let intervalCounter = 0;
//     let intervalCommand = () => {
//         let tempIntervalCounter = intervalCounter++;
//         let retrySendCounter = 0;
//         let connectAndSend = async () => {
//             let tempCounter = retrySendCounter++;
//             if (tempCounter) console.log(`[-] Retry send ${tempIntervalCounter}/${tempCounter}`);
//             await connect();
//             await sendHelloWorldCommand(channel, queueName);
//         }; 
//         retry( connectAndSend, {max_tries: 10 /*, throw_original: true*/})
//         // connectAndSend()
//             .catch((err) => {
//                 console.error('[-] Another way to catch error?', err.message, err.name);
//                 if (channel) {
//                     console.log(`[-] Closing channel for interval ${tempIntervalCounter}`);
//                     channel.close();
//                     channel = null;
//                 }
//             });
//     };
    
//     setInterval(intervalCommand, 1000);
// };

let startCommandBusProducer = async () => {
    let commandBus = new CommandBus(durableChannel);
    for(let i = 0; i < 100; i++) {
        let obj = {
            value: 'Hello World! ' + Math.round(Math.random()*1000),
            count: i,
        };
        let payload = JSON.stringify(obj);
        await commandBus.sendCommand('hello.world.2', payload);
    }
}

startCommandBusProducer()
    .then(() => {
        console.log('producer done');
    })
    .catch(err => console.error('[-] start producer error', err));
// retry(startProducer, {max_tries: 30, throw_original: true} )
//     .catch(err => console.error('[-] start producer error', err));