console.log('Consumer started');

const stats = require('measured').createCollection();
const amqp = require('amqplib');

const messageBus = require('message-bus/create-durable-queue-channel');

let startConsumer = async (doAck) => {
    let channel = await messageBus.getChannel();   
    let queueName = messageBus.getQueueName();
    console.log("[*] Waiting for messages in %s. To exit press CTRL+C", queueName);
    
    return await channel.consume(queueName, (msg) => {
        console.log("\t[x] Received %s", msg.content.toString());
        stats.meter('consume').mark();
        if (doAck) {
            setTimeout(() => {
                channel.ack(msg);
                console.log("\t[x] Acked %s", msg.content.toString());
            }, 0);
        }
    }, {noAck: !doAck});
}

startConsumer(true)
    .then((val) => {
        console.log('consumer started', val);
        // setInterval(() => {
        //     console.log(stats.toJSON());
        // }, 5000);
    } )
    .catch(err => console.error(err));