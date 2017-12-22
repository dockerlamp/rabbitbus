console.log('Producer started');

const amqp = require('amqplib');

const simpleQueueChannel = require('message-bus/create-simple-queue-channel');

let startProducer = async () => {
    let channel = await simpleQueueChannel.getChannel();   
    let queueName = simpleQueueChannel.getQueueName();
    console.log(` [*] Producer will send messages to queue "${queueName}"`);
    
    setInterval(() => {
        let obj = {
            value: 'Hello World!' + Math.round(Math.random()*1000)
        }
        let payload = JSON.stringify(obj);
        channel.sendToQueue(queueName, new Buffer(payload));
            // .catch(err => console.error('sendToQueue error', err));
        // console.log(" [x] Sent", payload);
    }, 1000);
};

startProducer()
    .catch(err => console.error(err));