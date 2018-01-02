console.log('Producer started');

const amqp = require('amqplib');
const retry = require('bluebird-retry');

const messageBus = require('message-bus/create-durable-queue-channel');

let counter = 0;

let sendHelloWorldCommand = async (channel, queueName) => {
    try {
        counter++;
        let obj = {
            value: 'Hello World! ' + Math.round(Math.random()*1000),
            counter
        }
        let payload = JSON.stringify(obj);
        let sendResult = channel.sendToQueue(queueName, new Buffer(payload), { persistent: true});
        console.log("[+] Sent", payload, sendResult);
    } catch (err) {
        console.error('[-] Another way to catch error?', err);
        // setTimeout(() => process.exit(0), 500);
    }
};

let connectionCounter = 0;
let startProducer = async () => {
    console.log('Connecting to rabbit, try', ++connectionCounter);
    let channel = await messageBus.getChannel();   
    let queueName = messageBus.getQueueName();
    console.log(`[+] Producer will send messages to queue "${queueName}"`);
    
    setInterval(() => sendHelloWorldCommand(channel, queueName), 1000);
};


retry(startProducer, {max_tries: 30, throw_original: true} )
    .catch(err => console.error('[-] start producer error', err));