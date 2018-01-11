<?php

require_once __DIR__.'/../../vendor/autoload.php';

$connection = new PhpAmqpLib\Connection\AMQPLazyConnection(
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

while(true) {
    print "tick\n";
    sleep(1);
}