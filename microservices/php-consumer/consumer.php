<?php
$QUEUE_NAME = 'durable';

require_once __DIR__.'/../../vendor/autoload.php';

pcntl_async_signals(true);

// signal handler function
function sig_handler($signo) {
    switch ($signo) {
        case SIGTERM:
        case SIGHUP:
            print "signal '$signo' handled\n";
            exit;
            break;
        default:
    }
}

pcntl_signal(SIGTERM, "sig_handler");
pcntl_signal(SIGHUP,  "sig_handler");

$connection = new \PhpAmqpLib\Connection\AMQPConnection(
    'rabbitmq',
    5672,
    'guest',
    'guest',
    '/',
    false,
    'AMQPLAIN',
    null,
    'en_US',
    10,
    3
);

print "connected\n";
$channel = $connection->channel();

$channel->queue_declare($QUEUE_NAME, false, true, false, false);

$callback = function($msg){
  echo "\t[x] Received {$msg->body}\n";
  $msg->delivery_info['channel']->basic_ack($msg->delivery_info['delivery_tag']);
  echo "\t[x] Acked\n";
};

$channel->basic_qos(null, 1, null);
$channel->basic_consume($QUEUE_NAME, '', false, false, false, false, $callback);

while(count($channel->callbacks)) {
    $channel->wait();
}

$channel->close();
$connection->close();