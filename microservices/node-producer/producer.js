console.log('Producer started');

const amqp = require('amqplib');

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
    }
};

let startProducer = async () => {
    let channel = await messageBus.getChannel();   
    channel.on('error', err => {
        console.error('[-] producer channel error', err);
    });
    let queueName = messageBus.getQueueName();
    console.log(`[+] Producer will send messages to queue "${queueName}"`);
    
    setInterval(() => sendHelloWorldCommand(channel, queueName), 1000);
};

startProducer()
    .catch(err => console.error('[-] start producer error', err));