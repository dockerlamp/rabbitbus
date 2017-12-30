console.log('Producer started');

const amqp = require('amqplib');

const messageBus = require('message-bus/create-durable-queue-channel');
let counter = 0;

let startProducer = async () => {
    let channel = await messageBus.getChannel();   
    let queueName = messageBus.getQueueName();
    console.log(` [*] Producer will send messages to queue "${queueName}"`);
    
    setInterval(() => {
        counter++;
        let obj = {
            value: 'Hello World!' + Math.round(Math.random()*1000),
            counter
        }
        let payload = JSON.stringify(obj);
        channel.sendToQueue(queueName, new Buffer(payload), { persistent: true});
            // .catch(err => console.error('sendToQueue error', err));
        console.log(" [x] Sent", payload);
    }, 1000);
};

startProducer()
    .catch(err => console.error(err));