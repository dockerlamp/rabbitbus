console.log('Consumer started');

const stats = require('measured').createCollection();
const amqp = require('amqplib');

const simpleQueueChannel = require('./create-simple-queue-channel');

let startConsumer = async () => {
    let channel = await simpleQueueChannel.getChannel();   
    let queueName = simpleQueueChannel.getQueueName();
    console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queueName);
    
    return await channel.consume(queueName, (msg) => {
        //console.log(" [x] Received %s", msg.content.toString());
        stats.meter('consume').mark();
    }, {noAck: true});
}

startConsumer()
    .then((val) => {
        console.log('consumer started', val);
        setInterval(() => {
            console.log(stats.toJSON());
        }, 5000);
    } )
    .catch(err => console.error(err));